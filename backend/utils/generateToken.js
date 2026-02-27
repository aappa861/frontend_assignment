import jwt from 'jsonwebtoken';

/**
 * Generates a JWT for the given user id.
 * Uses JWT_SECRET and JWT_EXPIRE from environment (default 7d).
 */
export const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};
