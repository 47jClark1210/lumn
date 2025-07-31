const fs = require('fs');
const path = require('path');
const { fileURLToPath } = require('url');
const { createLogger, format, transports } = require('winston');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logger = createLogger({
  level: 'info',
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
    }),
    new transports.File({ filename: path.join(logDir, 'combined.log') }),
  ],
});

module.exports = logger;
