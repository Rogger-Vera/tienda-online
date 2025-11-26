import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Configuracion de Winston Logger
 * 
 * Niveles: error > warn > info > http > debug
 * 
 * - error: Solo errores criticos → error.log
 * - warn/info/http/debug: Todo → combined.log
 * - http: Solo peticiones HTTP → http.log
 * - En desarrollo: Tambien muestra en consola con colores
 */

// Formato personalizado para logs
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }), // Include stack trace
  winston.format.printf(({ timestamp, level, message, stack }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
  })
);

// Formato para consola (con colores)
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} ${level}: ${message}`;
  })
);

// Crear transports
const transports = [
  // Errores en archivo separado
  new winston.transports.File({
    filename: path.join(__dirname, '../../logs/error.log'),
    level: 'error',
    format: logFormat,
  }),
  
  // Todos los logs en combined
  new winston.transports.File({
    filename: path.join(__dirname, '../../logs/combined.log'),
    format: logFormat,
  }),
  
  // Logs HTTP en archivo separado
  new winston.transports.File({
    filename: path.join(__dirname, '../../logs/http.log'),
    level: 'http',
    format: logFormat,
  }),
];

// En desarrollo, agregar consola
if (process.env.NODE_ENV !== 'production') {
  transports.push(
    new winston.transports.Console({
      format: consoleFormat,
      level: 'debug', // Mostrar hasta nivel debug en desarrollo
    })
  );
}

// Crear logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  transports,
  // No salir en excepciones
  exitOnError: false,
});

/**
 * Logger para peticiones HTTP con Express
 * Middleware personalizado
 */
export const httpLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const message = `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`;
    
    if (res.statusCode >= 500) {
      logger.error(message);
    } else if (res.statusCode >= 400) {
      logger.warn(message);
    } else {
      logger.http(message);
    }
  });
  
  next();
};

export default logger;