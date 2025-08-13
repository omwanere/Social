import io from 'socket.io-client';

let socket = null;

export const connectSocket = (userId) => {
  if (!socket) {
    const token = localStorage.getItem('token');
    
    socket = io('https://social-sabs.onrender.com', {
      withCredentials: true,
      auth: {
        userId: userId,
        token: token
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 10000,
      extraHeaders: {
        'Authorization': `Bearer ${token}`
      }
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
    });

    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    socket.on('connect_timeout', (timeout) => {
      console.error('Socket connection timeout:', timeout);
    });
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export default socket;
