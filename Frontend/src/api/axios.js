import axios from "axios";
import { logout } from "@/redux/AuthSlice";
import store from "@/redux/store";

// Create Axios instance
const api = axios.create({
  baseURL: "https://social-nlhq.onrender.com/api/v1",
  withCredentials: true, // send cookies automatically
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: include Authorization header only if user has a token
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 responses globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      store.dispatch(logout());
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
