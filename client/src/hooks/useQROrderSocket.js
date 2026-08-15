import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { env } from "../config/env";

export default function useQROrderSocket(session, onStatusUpdate) {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!session) return;

    const socket = io(env.socketUrl, {
      transports: ["polling", "websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("customer socket connected:", socket.id);
      socket.emit("join:customer", { sessionId: session.id });
    });

    socket.on("order:statusUpdated", ({ orderId, status }) => {
      console.log("status update received:", orderId, status);
      onStatusUpdate(orderId, status);
    });

    socket.on("disconnect", () => {
      console.log("customer socket disconnected");
    });

    return () => {
      socket.disconnect();
    };
  }, [session?.id, onStatusUpdate]);
}
