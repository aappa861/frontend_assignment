/**
 * Centralized error handling middleware.
 * Handles validation, Mongoose, and JWT errors with consistent JSON responses.
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = 'Internal Server Error';

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  } else if (err.code === 11000) {
    statusCode = 400;
    message = 'Duplicate field value (e.g. email already in use).';
  } else if (err.message) {
    message = err.message;
    if (err.statusCode) statusCode = err.statusCode;
  }

  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorHandler;
