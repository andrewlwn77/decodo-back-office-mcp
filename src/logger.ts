import winston from 'winston';
import { appConfig } from './config.js';

export const logger = winston.createLogger({
  level: appConfig.LOG_LEVEL,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: appConfig.MCP_SERVER_NAME },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// Create wrapper functions to ensure no sensitive data is logged
const sanitizeMessage = (message: any): any => {
  if (typeof message === 'string') {
    return message
      .replace(/api_key=[^&\s]+/gi, 'api_key=***')
      .replace(/Authorization:\s*[^\s]+/gi, 'Authorization: ***');
  }
  return message;
};

const sanitizeMeta = (meta: any): any => {
  if (meta && typeof meta === 'object') {
    const stringified = JSON.stringify(meta);
    const sanitized = stringified.replace(/"api_key"\s*:\s*"[^"]+"/gi, '"api_key":"***"');
    return JSON.parse(sanitized);
  }
  return meta;
};

// Override winston methods with sanitization
const originalInfo = logger.info.bind(logger);
const originalError = logger.error.bind(logger);
const originalWarn = logger.warn.bind(logger);
const originalDebug = logger.debug.bind(logger);

logger.info = (message: any, meta?: any) => originalInfo(sanitizeMessage(message), sanitizeMeta(meta));
logger.error = (message: any, meta?: any) => originalError(sanitizeMessage(message), sanitizeMeta(meta));
logger.warn = (message: any, meta?: any) => originalWarn(sanitizeMessage(message), sanitizeMeta(meta));
logger.debug = (message: any, meta?: any) => originalDebug(sanitizeMessage(message), sanitizeMeta(meta));