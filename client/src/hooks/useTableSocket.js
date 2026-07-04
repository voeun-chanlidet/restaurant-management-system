import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { SOCKET_URL } from "../config/api";

const useTableSocket = ({ onTableUpdate }) => {
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      auth: { token: localStorage.getItem("token") },
      transports: ["polling", "websocket"],
    });
    socketRef.current = socket;

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
