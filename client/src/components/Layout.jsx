import { useEffect, useCallback } from "react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import Sidebar from "./Sidebar/Sidebar";

export default function Layout({ children }) {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const socket = io(import.meta.env.VITE_SOCKET_URL, {
      transports: ["polling", "websocket"],
      auth: { token: localStorage.getItem("token") },
    });

    socket.on("connect", () => {
      socket.emit("join:room", user.role.toLowerCase());
    });

    socket.on("order:new", (order) => {
      if (user.role === "ADMIN" || user.role === "STAFF") {
        toast(`🔔 New order — Table ${order.tableNumber}`, {
          style: {
            background: "#fff5f5",
            color: "#b91c1c",
            border: "1px solid #fca5a5",
          },
          duration: 5000,
        });
      }
    });

    return () => socket.disconnect();
  }, [user]);

  return (
    <div className="flex h-screen bg-page">
      <Sidebar />
      <main className="flex-1 overflow-y-auto pt-12 lg:pt-0">{children}</main>
    </div>
  );
}
