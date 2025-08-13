import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProtectedRoutes = ({ children }) => {
  const { user } = useSelector((store) => store.auth);
  const location = useLocation();

  // If we're on login/signup page and user is authenticated, redirect to home
  if ((location.pathname === "/login" || location.pathname === "/signup") && user) {
    return <Navigate to="/home" replace />;
  }

  // If we're not on login/signup page and user is not authenticated, redirect to login
  if (!user && !["/login", "/signup"].includes(location.pathname)) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoutes;
