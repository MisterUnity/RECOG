const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = createLogger({
  format: combine(
    label({ label: 'RECOG-SYS' }),
    timestamp({format: () => {
      return new Date().toLocaleString();
    }}),
    myFormat
  ),
  // level: 'info',
  // format: format.json(),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: 'info.log',
      level: 'info'
    }),
    new transports.File({
      filename: 'errors.log',
      level: 'error'
    })
  ],
});

const requestLoggerFormat = (req, res) => {
  const {url, method} = req;
  const {locals} = res;
  return `[Url] ${url}, [Method] ${method}, [Detail] ${locals.message}`;
};

const normalLoggerFormat = (message) => {
  return `[Detail] ${message}`;
};

module.exports = {
  logger, requestLoggerFormat, normalLoggerFormat
};