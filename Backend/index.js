import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import messageRoute from "./routes/message.route.js";
import { app, server } from "./socket/socket.js";
import path from "path";

dotenv.config();

const PORT = process.env.PORT || 3000;

// const __dirname = path.resolve();

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection:", reason);
});

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// const allowedOrigins = [
//   "https://social-frontend-16lb75gew-omwaneres-projects.vercel.app",
//   "https://social-frontend-git-main-omwaneres-projects.vercel.app",
//   "https://social-frontend-git-main-omwaneres-projects.vercel.app",
// ];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman) or any origin
    if (!origin) return callback(null, true);

    // Reflect the request origin back in the response header
    callback(null, origin);
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);

app.get("/", (req, res) => {
  res.send("Backend server is running");
});

server.listen(PORT, () => {
  connectDB();
  console.log(`🚀 Server running at port ${PORT}`);
});
