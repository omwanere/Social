import { useEffect } from "react";
import ChatPage from "./components/ChatPage";
import EditProfile from "./components/EditProfile";
import Home from "./components/Home";
import Login from "./components/Login";
import MainLayout from "./components/MainLayout";
import Profile from "./components/Profile";
import Signup from "./components/Signup";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { SocketProvider, useSocket } from "./lib/SocketContext.jsx";
import { setOnlineUsers } from "./redux/chatSlice";
import { setLikeNotification } from "./redux/rtnSlice";
import ProtectedRoutes from "./components/ProtectedRoutes";

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoutes>
        <MainLayout />
      </ProtectedRoutes>
    ),
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoutes>
            <Home />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/profile/:id",
        element: (
          <ProtectedRoutes>
            {" "}
            <Profile />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/account/edit",
        element: (
          <ProtectedRoutes>
            <EditProfile />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/chat",
        element: (
          <ProtectedRoutes>
            <ChatPage />
          </ProtectedRoutes>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
]);

function SocketManager() {
  const { user } = useSelector((store) => store.auth);
  const { socket, setSocket } = useSocket();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      // Only create new socket if it doesn't exist
      if (!socket) {
        const socketio = io("http://localhost:8000", {
          query: {
            userId: user?._id,
          },
          transports: ["websocket"],
        });
        
        // Set up event listeners
        socketio.on("getOnlineUsers", (onlineUsers) => {
          dispatch(setOnlineUsers(onlineUsers));
        });

        socketio.on("notification", (notification) => {
          dispatch(setLikeNotification(notification));
        });

        // Save socket to context
        setSocket(socketio);
      }

      // Cleanup function
      return () => {
        if (socket) {
          socket.close();
          setSocket(null);
        }
      };
    }
  }, [user, socket, setSocket, dispatch]);

  return null; // This component doesn't render anything
}

function App() {
  return (
    <SocketProvider>
      <SocketManager />
      <RouterProvider router={browserRouter} />
    </SocketProvider>
  );
}

export default App;
