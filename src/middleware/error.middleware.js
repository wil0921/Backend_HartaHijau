const responseError = (err, req, res, next) => {
  const statusCode = err.statusCode;
  const status = err.status;
  const message = err.message;

  res.status(statusCode).json({
    status,
    message,
  });
};

const errorMiddleware = { responseError };
module.exports = errorMiddleware;
