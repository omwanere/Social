import io from "socket.io-client";

let socket = null;

export const connectSocket = (userId) => {
  if (!socket) {
    socket = io("https://social-nlhq.onrender.com/", {
      withCredentials: true,
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 10000,
      auth: {
        token: document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1],
      },
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    socket.on("connect", () => {
      console.log("Socket connected");
      // Authenticate socket after connection
      if (token) {
        socket.emit("authenticate", token);
      }
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    socket.on("connect_timeout", (timeout) => {
      console.error("Socket connection timeout:", timeout);
    });
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export default socket;
