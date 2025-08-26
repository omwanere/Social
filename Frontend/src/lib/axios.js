import axios from "axios";

// Remove VITE_BACKEND_BASEURL from here since we'll use the full URL
const api = axios.create({
  baseURL: "https://social-nlhq.onrender.com/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Remove the token interceptor since we're using cookie-based auth
// The token is stored in an HTTP-only cookie by the backend

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized error (e.g., redirect to login)
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
