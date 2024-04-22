const { CustomError } = require("../utils");

const responseError = (err, req, res, next) => {
  // Jika error bukan instance dari ClientError, set sebagai ServerError
  if (!(err instanceof CustomError.ClientError)) {
    err = new CustomError.ServerError(err.message).setStatusCode(
      err.statusCode || 500
    );
  }

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

const errorMiddleware = { responseError };
module.exports = errorMiddleware;
