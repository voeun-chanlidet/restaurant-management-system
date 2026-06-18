import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

export default function useQROrderSocket(session, onStatusUpdate) {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!session) return;

    const socket = io(
      import.meta.env.VITE_SOCKET_URL || "http://localhost:5000",
      {
        transports: ["websocket"],
      },
    );

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
  }, [session]);
}
