import React, { createContext, useContext, useEffect, useRef } from "react";
import { connectSocket, disconnectSocket } from "./socket";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const socketRef = useRef(null);

  useEffect(() => {
    if (userId && token) {
      socketRef.current = connectSocket(userId);
      return () => disconnectSocket();
    }
  }, [userId, token]);

  return React.createElement(
    SocketContext.Provider,
    { value: socketRef.current },
    children
  );
};

export const useSocket = () => useContext(SocketContext);
