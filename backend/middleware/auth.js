import jwt from 'jsonwebtoken';

/**
 * Middleware to verify JWT token
 * Protects admin routes
 */
export const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer token

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.adminId = decoded.id;
    req.adminUsername = decoded.username;

    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

/**
 * Generate JWT token
 */
export const generateToken = (adminId, adminUsername) => {
  return jwt.sign(
    {
      id: adminId,
      username: adminUsername
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '24h'
    }
  );
};
