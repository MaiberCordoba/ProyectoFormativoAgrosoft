import { addToast } from "@heroui/toast";

interface WebSocketConfig {
  url: string;
  onMessage: (data: any) => void;
  onOpen?: () => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (event: Event) => void;
}

class WebSocketService {
  private static instance: WebSocketService;
  private sockets: Map<string, WebSocket> = new Map();
  private reconnectAttempts: Map<string, number> = new Map();
  private isReconnecting: Map<string, boolean> = new Map();
  private maxReconnectAttempts = 5;
  private maxReconnectTime = 180000; // 3 minutos
  private baseDelay = 1000; // 1 segundo

  private constructor() {}

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  public connect(config: WebSocketConfig): void {
    const { url, onMessage, onOpen, onClose, onError } = config;

    // Evitar conexiones redundantes
    if (this.sockets.has(url) && this.sockets.get(url)?.readyState === WebSocket.OPEN) {
      return;
    }

    // Cerrar conexión existente si está en otro estado
    if (this.sockets.has(url)) {
      this.close(url);
    }

    const ws = new WebSocket(url);
    this.sockets.set(url, ws);
    this.reconnectAttempts.set(url, 0);
    this.isReconnecting.set(url, false);

    // Timeout para conexiones que no se establecen
    const timeout = setTimeout(() => {
      if (ws.readyState !== WebSocket.OPEN) {
        this.close(url);
        this.reconnect(config);
      }
    }, 10000);

    ws.onopen = () => {
      clearTimeout(timeout);
      this.reconnectAttempts.set(url, 0);
      this.isReconnecting.set(url, false);
      onOpen?.();
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };

    ws.onclose = (event) => {
      clearTimeout(timeout);
      this.sockets.delete(url);
      console.log(`WebSocket cerrado para ${url}, código: ${event.code}`);
      onClose?.(event);
      if (event.code !== 1000 && this.reconnectAttempts.get(url)! < this.maxReconnectAttempts) {
        this.reconnect(config);
      } else if (event.code !== 1000) {
        addToast({
          title: "Error de conexión",
          description: `No se pudo conectar al servidor para ${url}. Intenta recargar la página.`,
          color: "danger",
        });
      }
    };

    ws.onerror = (event) => {
      clearTimeout(timeout);
      console.error(`Error en WebSocket para ${url}`, event);
      onError?.(event);
      this.close(url);
      this.reconnect(config); // Intentar reconectar tras error
    };
  }

  private reconnect(config: WebSocketConfig): void {
    const { url } = config;
    const attempts = this.reconnectAttempts.get(url)! + 1;
    const totalTime = attempts * this.baseDelay * Math.pow(2, attempts);

    if (totalTime > this.maxReconnectTime || attempts > this.maxReconnectAttempts) {
      console.warn(`Máximo tiempo o intentos de reconexión alcanzados para ${url}`);
      addToast({
        title: "Error de conexión",
        description: `No se pudo reconectar al servidor para ${url}. Por favor, recarga la página.`,
        color: "danger",
      });
      return;
    }

    if (this.isReconnecting.get(url)) {
      console.log(`Reconexión ya en curso para ${url}`);
      return;
    }

    this.isReconnecting.set(url, true);
    this.reconnectAttempts.set(url, attempts);

    const delay = Math.min(this.baseDelay * Math.pow(2, attempts), 30000);
    console.log(`Intentando reconectar a ${url} en ${delay}ms (intento ${attempts})`);
    setTimeout(() => {
      this.connect(config);
      this.isReconnecting.set(url, false);
    }, delay);
  }

  public close(url: string): void {
    const ws = this.sockets.get(url);
    if (ws && ws.readyState !== WebSocket.CLOSED) {
      ws.close(1000, "Cierre intencionado");
    }
    this.sockets.delete(url);
    this.reconnectAttempts.set(url, 0);
    this.isReconnecting.set(url, false);
  }

  public isConnected(url: string): boolean {
    const ws = this.sockets.get(url);
    return !!ws && ws.readyState === WebSocket.OPEN;
  }
}

export const websocketService = WebSocketService.getInstance();