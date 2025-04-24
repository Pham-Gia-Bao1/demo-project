// src/hooks/useWebSocket.ts
import { useEffect, useRef, useState } from 'react';

export const useWebSocket = (wsUrl: string) => {
  const ws = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Khởi tạo kết nối
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log('🔌 WebSocket connected');
      setIsConnected(true);
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('📩 Message received:', data);
        localStorage.setItem("zoho", data)
        setMessages((prev) => [...prev, data]);
      } catch (err) {
        console.error('❌ Failed to parse message', err);
      }
    };

    ws.current.onerror = (err) => {
      console.error('⚠️ WebSocket error:', err);
    };

    ws.current.onclose = () => {
      console.log('🔌 WebSocket disconnected');
      setIsConnected(false);
    };

    return () => {
      ws.current?.close();
    };
  }, [wsUrl]);

  const sendMessage = (data: any) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(data));
    } else {
      console.warn('WebSocket is not open. Message not sent:', data);
    }
  };

  return { isConnected, messages, sendMessage };
};
