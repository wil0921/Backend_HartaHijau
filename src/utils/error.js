class ClientError extends Error {
  constructor(
    message = "Terjadi kesalahan pada sisi client",
    status = false,
    statusCode = 400
  ) {
    super(message);
    this.status;
    this.statusCode;
  }

  // Metode untuk mengatur statusCode
  setStatusCode(newStatusCode) {
    this.statusCode = newStatusCode;
  }
}

class ServerError extends Error {
  constructor(
    message = "Terjadi kesalahan pada sisi server",
    status = false,
    statusCode = 500
  ) {
    super(message);
    this.status;
    this.statusCode;
  }

  // Metode untuk mengatur statusCode
  setStatusCode(newStatusCode) {
    this.statusCode = newStatusCode;
  }
}

const CustomError = { ClientError, ServerError };

module.exports = CustomError;
