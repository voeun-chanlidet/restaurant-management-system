import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const useOrderSocket = ({ onNewOrder, onOrderUpdate }) => {
  const socketRef = useRef(null);
  useEffect(() => {
    const socket = io("http://localhost:5000", {
      auth: { token: localStorage.getItem("token") },
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connected", () => {
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
  }, [onNewOrder, onOrderUpdate]);
};

export default useOrderSocket;
