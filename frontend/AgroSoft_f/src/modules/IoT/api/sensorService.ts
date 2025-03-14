const SOCKET_URL = "ws://127.0.0.1:8000/ws/sensor/1/";

export const connectWebSocket = (onMessage: (data: any) => void) => {
  const socket = new WebSocket(SOCKET_URL);

  socket.onopen = () => console.log("✅ Conectado al WebSocket");
  socket.onmessage = (event) => onMessage(JSON.parse(event.data));
  socket.onerror = (error) => console.error("❌ Error en WebSocket", error);
  socket.onclose = () => console.log("❌ WebSocket cerrado");

  return socket;
};
