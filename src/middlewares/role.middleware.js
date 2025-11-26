import AppError from '../utils/AppError.js';
import logger from '../config/logger.js';

/**
 * Middleware para verificar roles
 * Debe usarse despues del middleware authenticate
 * 
 * @param {string[]} allowedRoles - Array de nombres de roles permitidos
 * @returns {function} Middleware function
 * 
 * @example
 * router.get('/admin', authenticate, authorize(['ADMIN']), controller)
 */
export const authorize = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        throw new AppError('Usuario no autenticado', 401);
      }

      // Obtener el rol del usuario desde la base de datos
      const { default: prisma } = await import('../config/database.js');
      
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        include: { role: true },
      });

      if (!user) {
        throw new AppError('Usuario no encontrado', 404);
      }

      if (!user.isActive) {
        throw new AppError('Usuario inactivo', 403);
      }

      // Verificar si el rol del usuario esta permitido
      if (!allowedRoles.includes(user.role.nombre)) {
        logger.warn(`Acceso denegado para usuario ${user.email} con rol ${user.role.nombre}`);
        throw new AppError('No tienes permisos para esta accion', 403);
      }

      // Agregar rol al objeto user en request
      req.user.role = user.role.nombre;
      
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Middleware especifico para admin
 */
export const requireAdmin = authorize(['ADMIN']);

/**
 * Middleware para admin o usuario (todos los autenticados)
 */
export const requireAuth = authorize(['ADMIN', 'USUARIO']);