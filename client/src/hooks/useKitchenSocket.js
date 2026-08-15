import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { env } from "../config/env";

const useKitchenSocket = ({ onNewOrder, onOrderCancelled, onMarkReady }) => {
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io(env.socketUrl, {
      auth: { token: localStorage.getItem("token") },
      transports: ["polling", "websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("KDS connected:", socket.id);
    });

    socket.on("order:inProgress", (order) => {
      onNewOrder(order);
    });

    socket.on("order:ready", (order) => {
      onMarkReady(order.id);
    });

    socket.on("order:cancelled", (order) => {
      onOrderCancelled(order);
    });

    return () => {
      socket.disconnect();
    };
  }, [onNewOrder, onOrderCancelled, onMarkReady]);
};

export default useKitchenSocket;
