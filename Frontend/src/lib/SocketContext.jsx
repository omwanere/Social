import React from "react";
import { createContext, useContext, useEffect } from "react";
import { connectSocket, disconnectSocket } from './socket';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  let socket;

  useEffect(() => {
    if (userId && token) {
      socket = connectSocket(userId);
      return () => disconnectSocket();
    }
  }, [userId, token]);

  return React.createElement(
    SocketContext.Provider,
    { value: socket },
    children
  );
};

export const useSocket = () => useContext(SocketContext);