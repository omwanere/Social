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
    // Check if we have a valid cookie and user data
    if (!user) {
      // Try to fetch user data from the backend
      api.get('/api/v1/user/me')
        .then(res => {
          if (res.data.success) {
            dispatch(setAuthUser(res.data.user));
          }
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
        });
    }
  }, [dispatch, user]);

  return (
    <SocketProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route element={<MainLayout />}>
            <Route
              path="/home"
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
          <Route path="/login" element={user ? <Navigate to="/home" replace /> : <Login />} />
          <Route
            path="/signup"
            element={user ? <Navigate to="/home" replace /> : <Signup />}
          />
        </Routes>
        <Toaster position="top-center" richColors />
      </Router>
    </SocketProvider>
  );
}

export default App;
