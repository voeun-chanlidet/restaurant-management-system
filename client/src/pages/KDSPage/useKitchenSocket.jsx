import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const useKitchenSocket = ({ onNewOrder, onOrderCancelled, onMarkReady }) => {
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io(
      window.location.hostname === "localhost"
        ? "http://localhost:5000"
        : `http://${window.location.hostname}:5000`,
      {
        auth: { token: localStorage.getItem("token") },
        transports: ["websocket"],
      },
    );

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
  }, []);
};

export default useKitchenSocket;
