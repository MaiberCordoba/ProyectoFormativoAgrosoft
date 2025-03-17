import { useEffect, useState } from "react";

const SOCKET_URL = "ws://127.0.0.1:8000/ws/sensores/";

const useSensorData = () => {
    const [data, setData] = useState<any[]>([]);
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const connectWebSocket = () => {
            const ws = new WebSocket(SOCKET_URL);
            setSocket(ws);

            ws.onopen = () => console.log("✅ WebSocket conectado");

            ws.onmessage = (event) => {
                console.log("📡 Datos recibidos:", event.data);
                try {
                    setData(JSON.parse(event.data));
                } catch (error) {
                    console.error("❌ Error al parsear JSON:", error);
                }
            };

            ws.onerror = (error) => console.error("❌ Error en WebSocket:", error);

            ws.onclose = () => {
                console.warn("⚠️ WebSocket cerrado, reintentando en 5 segundos...");
                setTimeout(connectWebSocket, 5000); // Reintento automático
            };
        };

        connectWebSocket();

        return () => {
            if (socket) {
                socket.close();
            }
        };
    }, []);

    return { data };
};

export default useSensorData;
