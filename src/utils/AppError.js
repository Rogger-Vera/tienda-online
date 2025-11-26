/**
 * Clase personalizada para errores de aplicacion
 * Extiende Error nativo de JavaScript
 * 
 * @param {string} message - Mensaje del error
 * @param {number} statusCode - Codigo HTTP del error
 * @param {boolean} isOperational - Si es un error esperado u operacional
 */
class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = isOperational;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;