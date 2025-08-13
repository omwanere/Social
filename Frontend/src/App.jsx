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
import { Toaster } from "sonner";
import { SocketProvider, useSocket } from "./lib/SocketContext.jsx";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import MainLayout from "./components/MainLayout";
import Profile from "./components/Profile";
import Messages from "./components/Messages";
import ChatPage from "./components/ChatPage";
import ProtectedRoutes from "./components/ProtectedRoutes";
import "./index.css";
import { AppWindowIcon } from "lucide-react";
import api from "./lib/axios";

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      dispatch(setAuthUser(storedUser));
    }
  }, [dispatch]);

  return (
    <SocketProvider>
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
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route
            path="/signup"
            element={user ? <Navigate to="/" /> : <Signup />}
          />
        </Routes>
        <Toaster position="top-center" richColors />
      </Router>
    </SocketProvider>
  );
}

export default App;
