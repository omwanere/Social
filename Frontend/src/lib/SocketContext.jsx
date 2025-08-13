import React, { createContext, useContext, useEffect } from "react";
import { connectSocket, disconnectSocket } from "./socket";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const socketRef = React.useRef(null);

  useEffect(() => {
    if (userId && token) {
      socketRef.current = connectSocket(userId);
      return () => {
        if (socketRef.current) {
          disconnectSocket();
        }
      };
    }
  }, [userId, token]);

  return React.createElement(
    SocketContext.Provider,
    { value: socketRef.current },
    children
  );
};

export const useSocket = () => {
  const socket = useContext(SocketContext);
  if (socket === null) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return socket;
};
