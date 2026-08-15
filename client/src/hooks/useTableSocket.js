import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { env } from "../config/env";

const useTableSocket = ({ onTableUpdate }) => {
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io(env.socketUrl, {
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
