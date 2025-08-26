import { Server } from "socket.io";
import express from "express";
import http from "http";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "https://sociial.netlify.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  },
  pingTimeout: 60000, // 60 seconds
  pingInterval: 25000, // 25 seconds
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutes
    skipMiddlewares: true,
  },
});

const userSocketMap = {}; // userId -> socketId
const userSocketIds = new Map(); // socketId -> userId

export const getReceiverSocketId = (receiverId) => userSocketMap[receiverId];

// Handle connection errors
io.engine.on("connection_error", (err) => {
  console.error("Socket connection error:", err);
});

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (!userId) {
    console.warn("Socket connected without userId");
    return socket.disconnect(true);
  }

  // Clean up any existing connection for this user
  if (userSocketMap[userId]) {
    const oldSocketId = userSocketMap[userId];
    userSocketIds.delete(oldSocketId);
    delete userSocketMap[userId];
  }

  // Store new connection
  userSocketMap[userId] = socket.id;
  userSocketIds.set(socket.id, userId);

  // Notify all clients about updated online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Handle disconnection
  socket.on("disconnect", (reason) => {
    console.log(`Socket ${socket.id} disconnected. Reason: ${reason}`);
    const disconnectedUserId = userSocketIds.get(socket.id);

    if (disconnectedUserId && userSocketMap[disconnectedUserId] === socket.id) {
      delete userSocketMap[disconnectedUserId];
      userSocketIds.delete(socket.id);
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });

  // Handle errors
  socket.on("error", (error) => {
    console.error(`Socket error for user ${userId}:`, error);
  });
});

export { app, server, io };
