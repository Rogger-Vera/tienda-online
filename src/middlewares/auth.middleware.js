import { verifyToken } from '../utils/jwt.util.js';
import AppError from '../utils/AppError.js';
import logger from '../config/logger.js';

/**
 * Middleware de autenticacion JWT
 * Verifica que el token sea valido y agrega los datos del usuario a req.user
 * 
 * @param {object} req - Request de Express
 * @param {object} res - Response de Express
 * @param {function} next - Next function
 */
export const authenticate = (req, res, next) => {
  try {
    // Obtener token del header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Token no proporcionado', 401);
    }

    const token = authHeader.split(' ')[1];
    
    // Verificar y decodificar token
    const decoded = verifyToken(token);
    
    // Agregar datos del usuario a la request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      roleId: decoded.roleId,
    };
    
    logger.debug(`Usuario autenticado: ${decoded.email}`);
    next();
  } catch (error) {
    next(error);
  }
};