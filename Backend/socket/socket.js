import { Server } from "socket.io";
import express from "express";
import http from "http";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const app = express();
app.use(cookieParser());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://social-frontend-three-sandy.vercel.app",
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Authorization"],
  },
  cookie: true,
});

const userSocketMap = {}; // this map stores socket id corresponding the user id; userId -> socketId

export const getReceiverSocketId = (receiverId) => userSocketMap[receiverId];

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Get token from cookie
  const token = socket.handshake.auth.token;
  if (!token) {
    console.error('No token in cookie');
    socket.disconnect(true);
    return;
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const userId = decoded.userId;
  if (!userId) {
    console.error('No user ID in cookie');
    socket.disconnect(true);
    return;
  }

  // Verify user exists
  User.findById(userId)
    .then(user => {
      if (!user) {
        console.error('User not found:', userId);
        socket.disconnect(true);
        return;
      }

      // Store socket connection
      userSocketMap[userId] = socket.id;
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
    .catch(error => {
      console.error('Error verifying user:', error);
      socket.disconnect(true);
    });

  socket.on('disconnect', () => {
    if (socket.userId) {
      delete userSocketMap[socket.userId];
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, server, io };
