import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "./redux/AuthSlice";
import { setOnlineUsers } from "./redux/chatSlice";
import { setLikeNotification } from "./redux/rtnSlice";
import { io } from "socket.io-client";
import { Toaster } from "sonner";
import { SocketContext } from "./lib/SocketContext";
import { useState } from "react";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import MainLayout from "./components/MainLayout";
import Profile from "./components/Profile";
import Messages from "./components/Messages";
import ChatPage from "./components/ChatPage";
import ProtectedRoutes from "./components/ProtectedRoutes";
import "./index.css";

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      dispatch(setAuthUser(storedUser));
    }
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      const socketio = io("process.env.BACKEND_BASEURL", {
        withCredentials: true,
      });
      setSocket(socketio);
      socketio.on("getOnlineUsers", (users) => {
        dispatch(setOnlineUsers(users));
      });
      socketio.on("likeNotification", (data) => {
        dispatch(setLikeNotification(data));
      });
      return () => {
        socketio.disconnect();
      };
    }
  }, [user, dispatch]);

  return (
    <SocketContext.Provider value={socket}>
      <Router>
        <Routes>
          <Route element={<MainLayout />}>
            <Route
              path="/"
              element={
                <ProtectedRoutes>
                  <Home />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/profile/:id"
              element={
                <ProtectedRoutes>
                  <Profile />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/messages"
              element={
                <ProtectedRoutes>
                  <Messages />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/chat/:id"
              element={
                <ProtectedRoutes>
                  <ChatPage />
                </ProtectedRoutes>
              }
            />
          </Route>
          <Route
            path="/login"
            element={user ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/signup"
            element={user ? <Navigate to="/" /> : <Signup />}
          />
        </Routes>
        <Toaster position="top-center" richColors />
      </Router>
    </SocketContext.Provider>
  );
}

export default App;
