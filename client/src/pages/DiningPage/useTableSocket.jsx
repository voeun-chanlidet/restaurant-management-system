import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const useTableSocket = ({ onTableUpdate }) => {
  const sokcetRef = useRef(null);

  useEffect(() => {
    const socket = io("http://localhost:5000", {
      auth: { token: localStorage.getItem("token") },
      transports: ["websocket"],
    });
    sokcetRef.current = socket;

    socket.on("connect", () => {
      console.log("Table connected: ", socket.id);
    });

    socket.on("table:update", (table) => {
      console.log("table:update received", table);
      onTableUpdate(table);
    });
    return () => {
      socket.disconnect();
    };
  }, [onTableUpdate]);
};

export default useTableSocket;
