// src/hooks/useSocket.ts
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export function useSocket(url: string): Socket {
  const socketRef = useRef<Socket>(io(url, { autoConnect: false }));

  useEffect(() => {
    const socket = socketRef.current;
    socket.connect();
    return () => { socket.disconnect(); };
  }, []);

  return socketRef.current;
}
