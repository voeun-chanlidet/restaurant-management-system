import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { SOCKET_URL } from "../config/api";

export default function useSessionSocket({
  onNewOrder,
  onOrderUpdate,
  onOrderCancel,
}) {
  const socketRef = useRef(null);
  useEffect(() => {
    const socket = io(SOCKET_URL, {
      auth: { token: localStorage.getItem("token") },
      transports: ["polling", "websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Order connected : ", socket.id);
    });

    socket.on("order:new", (order) => {
      onNewOrder(order);
    });
    socket.on("order:inProgress", (order) => {
      onOrderUpdate(order);
    });
    socket.on("order:ready", (order) => {
      onOrderUpdate(order);
    });
    socket.on("order:served", (order) => {
      onOrderUpdate(order);
    });
    socket.on("order:cancelled", (order) => {
      onOrderCancel(order);
    });
    return () => {
      socket.disconnect();
    };
  }, [onNewOrder, onOrderUpdate, onOrderCancel]);
}
