const handleError = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || false;
  const message = err.message || "Terjadi kesalahan pada server";

  res.status(statusCode).json({
    status,
    message,
  });
};

const errorMiddleware = { handleError };
module.exports = errorMiddleware;
