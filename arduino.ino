#include <WiFi.h>
#include <ArduinoWebsockets.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <DHT.h>
#include <ArduinoJson.h>

using namespace websockets;

const char* ssid = "LA COLMENA";
const char* password = "Colmena66+1954*";

const char* websocket_server = "ws://192.168.101.71:8000/ws/sensor";
WebsocketsClient client;

Adafruit_SSD1306 display(128, 64, &Wire, -1);

#define DHTPIN 4
#define DHTTYPE DHT22  
DHT dht(DHTPIN, DHTTYPE);
#define FOTORESISTOR_PIN A0
#define VIENTO_PIN 5

const int SENSOR_TEM_ID = 25;
const int SENSOR_HUM_A_ID = 27; 
const int SENSOR_LUM_ID = 26;
const int SENSOR_VIE_ID = 28;
const int lote_id = 1;

unsigned long lastReconnectAttempt = 0;
const unsigned long reconnectInterval = 10000;

volatile unsigned long pulseStart = 0;
volatile unsigned long pulseEnd = 0;
volatile bool newPulse = false;
float windSpeed = 0;

const int NUM_READINGS = 5;
float tempReadings[NUM_READINGS] = {0};
float humReadings[NUM_READINGS] = {0};
int lumReadings[NUM_READINGS] = {0};
int readIndex = 0;

void IRAM_ATTR windPulseISR() {
  if (digitalRead(VIENTO_PIN) == HIGH) {
    pulseStart = micros();
  } else {
    pulseEnd = micros();
    newPulse = true;
  }
}

void setup() {
  Serial.begin(115200);
  
  if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println("Error OLED");
    while(1);
  }
  
  dht.begin();
  pinMode(FOTORESISTOR_PIN, INPUT);
  pinMode(VIENTO_PIN, INPUT_PULLUP);

  attachInterrupt(digitalPinToInterrupt(VIENTO_PIN), windPulseISR, CHANGE);

  for (int i = 0; i < NUM_READINGS; i++) {
    tempReadings[i] = dht.readTemperature();
    humReadings[i] = dht.readHumidity();
    lumReadings[i] = analogRead(FOTORESISTOR_PIN);
    delay(100);
  }

  conectarWiFi();
  conectarWebSocket();
}

void loop() {
  if(client.available()) {
    client.poll();
  } else {
    if(millis() - lastReconnectAttempt > reconnectInterval) {
      lastReconnectAttempt = millis();
      if(WiFi.status() != WL_CONNECTED) {
        conectarWiFi();
      }
      conectarWebSocket();
    }
  }

  if(newPulse) {
    noInterrupts();
    unsigned long pulseDuration = pulseEnd - pulseStart;
    newPulse = false;
    interrupts();
    
    if(pulseDuration > 0) {
      windSpeed = 1.0 / (pulseDuration * 0.000001 * 2.0);
    }
  }

  static unsigned long lastSend = 0;
  if(millis() - lastSend > 8000) {
    lastSend = millis();
    
    tempReadings[readIndex] = dht.readTemperature();
    humReadings[readIndex] = dht.readHumidity();
    lumReadings[readIndex] = analogRead(FOTORESISTOR_PIN);
    
    float temperatura = 0;
    float humedad = 0;
    int luz = 0;
    
    for (int i = 0; i < NUM_READINGS; i++) {
      temperatura += tempReadings[i];
      humedad += humReadings[i];
      luz += lumReadings[i];
    }
    
    temperatura /= NUM_READINGS;
    humedad /= NUM_READINGS;
    luz /= NUM_READINGS;
    
    readIndex = (readIndex + 1) % NUM_READINGS;

    if (isnan(temperatura) || isnan(humedad)) {
      Serial.println("Error en lectura de DHT22");
      return;
    }

    mostrarEnPantalla(temperatura, humedad, luz, windSpeed);

    if(client.available()) {
      enviarDato("TEM", temperatura, SENSOR_TEM_ID);
      delay(100);
      enviarDato("HUM_A", humedad, SENSOR_HUM_A_ID);
      delay(100);
      enviarDato("LUM", luz, SENSOR_LUM_ID);
      delay(100);
      enviarDato("VIE", windSpeed, SENSOR_VIE_ID);
    }
  }
  
  delay(100);
}

void mostrarEnPantalla(float temp, float hum, int luz, float viento) {
  display.clearDisplay();
  display.setCursor(0,0);
  display.println("Temp: " + String(temp, 1) + "C");
  display.println("Hum: " + String(hum, 1) + "%");
  display.println("Luz: " + String(luz));
  display.println("Viento: " + String(viento, 1) + "m/s");
  display.println(WiFi.status()==WL_CONNECTED?"WiFi: OK":"WiFi: OFF");
  display.println(client.available()?"WS: OK":"WS: OFF");
  display.display();
}

void enviarDato(String tipo, float valor, int sensor_id) {
  DynamicJsonDocument doc(200);
  doc["action"] = "update_sensor";  // Mismo nombre de acción
  doc["tipo"] = tipo;               // Mismo campo "tipo"
  doc["valor"] = valor;             // Mismo campo "valor"
  doc["fk_lote_id"] = lote_id;      // Mismo campo "fk_lote_id"
  
  String json;
  serializeJson(doc, json);
  
  bool success = client.send(json);
  Serial.println(success ? "Enviado: " + json : "Error enviando");
}

void conectarWiFi() {
  if(WiFi.status() == WL_CONNECTED) return;
  
  Serial.print("Conectando a WiFi...");
  WiFi.begin(ssid, password);
  
  int intentos = 0;
  while(WiFi.status() != WL_CONNECTED && intentos < 20) {
    delay(500);
    Serial.print(".");
    intentos++;
  }
  
  if(WiFi.status() == WL_CONNECTED) {
    Serial.println("\nConectado! IP: " + WiFi.localIP().toString());
  } else {
    Serial.println("\nError WiFi");
  }
}

void conectarWebSocket() {
  if(WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi no conectado, no se puede conectar WS");
    return;
  }
  
  Serial.print("Conectando WebSocket...");
  
  client.onMessage([&](WebsocketsMessage message) {
      Serial.print("Mensaje recibido: ");
      Serial.println(message.data());
  });
  
  client.onEvent([&](WebsocketsEvent event, String data) {
      if(event == WebsocketsEvent::ConnectionOpened) {
          Serial.println("Conexión WS abierta");
          client.send("{\"action\":\"register\",\"device\":\"arduino\"}");
      } else if(event == WebsocketsEvent::ConnectionClosed) {
          Serial.println("Conexión WS cerrada");
      } else if(event == WebsocketsEvent::GotPing) {
          Serial.println("Got a Ping!");
      } else if(event == WebsocketsEvent::GotPong) {
          Serial.println("Got a Pong!");
      }
  });
  
  client.addHeader("Origin", "http://192.168.101.71");
  
  bool connected = client.connect(websocket_server);
  if(connected) {
    Serial.println("Conectado!");
  } else {
    Serial.println("Error WS!");
  }
}