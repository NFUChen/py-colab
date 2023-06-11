import { useState, useEffect } from "react";
import io from "socket.io-client";

interface ISocketResponse<T> {
  data: T;
  emitEvent: (eventData: any) => void;
  isConnected: boolean;
}

export const useSocket = <T>(url: string, onEvent: string, init_value: any): ISocketResponse<T> => {
  const [data, setData] = useState(init_value);
  const [currentSocket, setCurrentSocket] = useState<any>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const emitEvent = (eventData: any): void => {
    if (currentSocket) {
      currentSocket.emit(onEvent, eventData);
    }
  };

  useEffect(() => {
    const socket = io(url).connect();

    socket.on("connect", () => {
      console.log(`Connected to server ${url}: listening ${onEvent}`);
      setIsConnected(true);
      setCurrentSocket(socket);

      socket.on(`${onEvent}_resp`, data => {
        setData(data);
      });
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    return () => {
      socket.off(onEvent);
      socket.disconnect();
    };
  }, []);

  return { data, emitEvent, isConnected };
};
