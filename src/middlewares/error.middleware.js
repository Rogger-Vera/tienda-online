import logger from '../config/logger.js';
import { errorResponse } from '../utils/response.util.js';

/**
 * Middleware global de manejo de errores
 * Debe ser el ultimo middleware en app.js
 * 
 * @param {Error} err - Error capturado
 * @param {object} req - Request de Express
 * @param {object} res - Response de Express
 * @param {function} next - Next function
 */
export const errorHandler = (err, req, res, next) => {
  // Log del error
  logger.error(`${err.name}: ${err.message}`);
  if (err.stack) {
    logger.error(err.stack);
  }

  // Determinar status code
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';

  // Errores de Prisma
  if (err.code === 'P2002') {
    return errorResponse(res, 409, 'El registro ya existe (campo unico duplicado)');
  }
  if (err.code === 'P2025') {
    return errorResponse(res, 404, 'Registro no encontrado');
  }
  if (err.code && err.code.startsWith('P')) {
    return errorResponse(res, 400, 'Error de base de datos', err.message);
  }

  // Errores operacionales (esperados)
  if (err.isOperational) {
    return errorResponse(res, statusCode, message);
  }

  // Errores no esperados (no exponer detalles en produccion)
  if (process.env.NODE_ENV === 'production') {
    return errorResponse(res, 500, 'Error interno del servidor');
  }

  // En desarrollo, mostrar detalles
  return errorResponse(res, statusCode, message, {
    stack: err.stack,
    details: err,
  });
};

/**
 * Middleware para rutas no encontradas (404)
 */
export const notFoundHandler = (req, res, next) => {
  const message = `Ruta no encontrada: ${req.method} ${req.originalUrl}`;
  logger.warn(message);
  return errorResponse(res, 404, message);
};