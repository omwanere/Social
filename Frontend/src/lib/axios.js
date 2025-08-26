import axios from "axios";

const api = axios.create({
  baseURL: "https://social-nlhq.onrender.com/api/v1",
  withCredentials: true, // This is important for sending cookies
  timeout: 30000, // 30 seconds timeout
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
    "Pragma": "no-cache",
    "Access-Control-Allow-Credentials": true
  },
  crossDomain: true,
  credentials: 'include' // This ensures cookies are sent with the request
});

// Remove the token interceptor since we're using cookie-based auth
// The token is stored in an HTTP-only cookie by the backend

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timed out. Please check your connection and try again.');
    } else if (error.response?.status === 401) {
      // Handle unauthorized error (e.g., redirect to login)
      window.location.href = "/login";
    } else if (error.response) {
      // The request was made and the server responded with a status code
      console.error('Response error:', error.response.status, error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('Request error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
