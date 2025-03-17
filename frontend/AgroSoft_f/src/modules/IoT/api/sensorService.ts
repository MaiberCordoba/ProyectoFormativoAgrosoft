const SOCKET_URL = "ws://127.0.0.1:8000/ws/sensores/";

export const connectWebSocket = (onMessage: (data: any) => void) => {
    const socket = new WebSocket(SOCKET_URL);

    socket.onopen = () => console.log("✅ WebSocket conectado");

    socket.onmessage = (event) => {
        try {
            const newData = JSON.parse(event.data);
            onMessage(newData);
        } catch (error) {
            console.error("❌ Error al parsear JSON:", error);
        }
    };

    socket.onerror = (error) => console.error("❌ Error en WebSocket:", error);

    socket.onclose = () => {
        console.warn("⚠️ WebSocket cerrado");
        setTimeout(() => connectWebSocket(onMessage), 5000); // Reintentar conexión
    };

    return socket;
};
