
function logRequestTime(req, res, next) {
    console.log(`Request received at ${new Date()}`);
    next(); 
  }
  
  function maintenanceMode(req, res, next) {
    const isMaintenanceMode = false; 
    if (isMaintenanceMode) {
      res.status(503).send('Maintenance Mode: Aplikasi sedang dalam perbaikan. Silakan coba lagi nanti.');
    } else {
      next();
    }
  }
  
  module.exports = {
    logRequestTime,
    maintenanceMode
  };
  