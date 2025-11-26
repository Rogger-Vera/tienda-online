/**
 * Utilidades para respuestas HTTP estandarizadas
 * Mantiene consistencia en todas las respuestas de la API
 */

/**
 * Respuesta exitosa
 * @param {object} res - Response de Express
 * @param {number} statusCode - Codigo HTTP
 * @param {string} message - Mensaje
 * @param {*} data - Datos a enviar
 */
export const successResponse = (res, statusCode, message, data = null) => {
  const response = {
    success: true,
    message,
  };
  
  if (data !== null) {
    response.data = data;
  }
  
  return res.status(statusCode).json(response);
};

/**
 * Respuesta de error
 * @param {object} res - Response de Express
 * @param {number} statusCode - Codigo HTTP
 * @param {string} message - Mensaje de error
 * @param {*} errors - Errores detallados (opcional)
 */
export const errorResponse = (res, statusCode, message, errors = null) => {
  const response = {
    success: false,
    message,
  };
  
  if (errors) {
    response.errors = errors;
  }
  
  return res.status(statusCode).json(response);
};