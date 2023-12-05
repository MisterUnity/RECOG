const { logger, requestLoggerFormat } = require("./vendor/winston");

const requestStart = (req, res, next)=>{
  res.locals.message = '===== Request start =====';
  logger.info(requestLoggerFormat(req, res));
  next();
};

const requestEnd = (req, res, next) => {
  res.locals.message = '===== Request End =====';
  logger.info(requestLoggerFormat(req, res));
  // next() not needed;
};

module.exports = {
  requestStart, requestEnd
};