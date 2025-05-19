#include <WiFi.h>
#include <ArduinoWebsockets.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <DHT.h>
#include <ArduinoJson.h>

using namespace websockets;

const char* ssid = "LA COLMENA";
const char* password = "Colmena66+1954*";

const char* websocket_server = "ws://192.168.101.70:8000/ws/sensor/";
WebsocketsClient client;

Adafruit_SSD1306 display(128, 64, &Wire, -1);

#define DHTPIN 4
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);
#define FOTORESISTOR_PIN A0
#define VIENTO_PIN 5

const int SENSOR_TEM_ID = 14;
const int SENSOR_HUM_A_ID = 16; 
const int SENSOR_LUM_ID = 17;
const int SENSOR_VIE_ID = 19;
const int lote_id = 1;

unsigned long lastReconnectAttempt = 0;
const unsigned long reconnectInterval = 10000; // 10 segundos

void setup() {
  Serial.begin(115200);
  
  if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println("Error OLED");
    while(1);
  }
  
  dht.begin();
  pinMode(FOTORESISTOR_PIN, INPUT);
  pinMode(VIENTO_PIN, INPUT);

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

  static unsigned long lastSend = 0;
  if(millis() - lastSend > 8000) {
    lastSend = millis();
    
    float temperatura = dht.readTemperature();
    float humedad = dht.readHumidity();
    int luz = analogRead(FOTORESISTOR_PIN);
    float viento = (pulseIn(VIENTO_PIN, HIGH) > 0) ? (2.4/pulseIn(VIENTO_PIN, HIGH))*1000 : 0;

    mostrarEnPantalla(temperatura, humedad, luz, viento);

    if(client.available()) {
      enviarDatos("TEM", temperatura, SENSOR_TEM_ID);
      delay(300);
      enviarDatos("HUM_A", humedad, SENSOR_HUM_A_ID);
      delay(300);
      enviarDatos("LUM", luz, SENSOR_LUM_ID);
      delay(300);
      enviarDatos("VIE", viento, SENSOR_VIE_ID);
    }
  }
  
  delay(100);
}

void mostrarEnPantalla(float temp, float hum, int luz, float viento) {
  display.clearDisplay();
  display.setCursor(0,0);
  display.println("Temp: " + String(temp) + "C");
  display.println("Hum: " + String(hum) + "%");
  display.println("Luz: " + String(luz));
  display.println("Viento: " + String(viento,1) + "m/s");
  display.println(WiFi.status()==WL_CONNECTED?"WiFi: OK":"WiFi: OFF");
  display.println(client.available()?"WS: OK":"WS: OFF");
  display.display();
}

void enviarDatos(String tipo, float valor, int sensor_id) {
  DynamicJsonDocument doc(200);
  doc["action"] = "update_sensor";
  doc["tipo"] = tipo;
  doc["valor"] = valor;
  doc["fk_lote_id"] = lote_id;
  
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
  
  client.addHeader("Origin", "http://192.168.101.70");
  
  bool connected = client.connect(websocket_server);
  if(connected) {
    Serial.println("Conectado!");
  } else {
    Serial.println("Error WS!");
  }
}