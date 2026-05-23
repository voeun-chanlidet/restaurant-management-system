const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("Client connected: ", socket.id);
    const token = socket.handshake.auth.token;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.join(decoded.role.toLowerCase());
        console.log(`Client ${socket.id} joined room: ${decoded.role}`);
      } catch (error) {
        console.log("Invalid socket token, disconnecting : ", socket.id);
      }
    }

    socket.on("disconnect", () => {
      console.log("Client disconnected: ", socket.id);
    });
  });
  return io;
};

const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
};

module.exports = { initSocket, getIO };
