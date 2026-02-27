import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Protects routes by validating JWT and attaching user to req.
 * Expects: Authorization: Bearer <token>
 */
export const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return res.status(401).json({ message: 'Not authorized. No token provided.' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found. Token invalid.' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: error.name === 'TokenExpiredError'
        ? 'Token expired. Please log in again.'
        : 'Not authorized. Invalid token.',
    });
  }
};
