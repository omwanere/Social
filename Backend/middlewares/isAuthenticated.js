import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    // Check for token in cookies first
    const token = req.cookies?.token;
    
    // If no token in cookies, check Authorization header (for API clients)
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const tokenFromHeader = authHeader.split(' ')[1];
        const decoded = jwt.verify(tokenFromHeader, process.env.SECRET_KEY);
        req.id = decoded.userId;
        return next();
      }
      
      return res.status(401).json({
        message: "Authentication required. Please log in.",
        success: false,
      });
    }

    // Verify the token
    const decoded = await jwt.verify(token, process.env.SECRET_KEY);
    
    // Attach user ID to the request object
    req.id = decoded.userId;
    
    // Continue to the next middleware/route handler
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    
    // Handle different JWT errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        message: "Invalid token. Please log in again.",
        success: false,
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: "Session expired. Please log in again.",
        success: false,
        expired: true
      });
    }
    
    // For other errors
    return res.status(500).json({
      message: "Authentication failed. Please try again.",
      success: false,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export default isAuthenticated;
