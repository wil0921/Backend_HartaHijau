const logRequestTime = (req, res, next) => {
  console.log(`Request received at ${new Date()}`);
  next();
};

const maintenanceMode = (req, res, next) => {
  const isMaintenanceMode = false;
  if (isMaintenanceMode) {
    res
      .status(503)
      .send(
        "Maintenance Mode: Aplikasi sedang dalam perbaikan. Silakan coba lagi nanti."
      );
  } else {
    next();
  }
};

const serverMiddleware = {
  logRequestTime,
  maintenanceMode,
};

module.exports = serverMiddleware;
