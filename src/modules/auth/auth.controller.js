import authService from './auth.service.js';
import { successResponse } from '../../utils/response.util.js';
import logger from '../../config/logger.js';

/**
 * Controlador de autenticacion
 * Maneja las requests HTTP y delega logica al servicio
 */
class AuthController {
  /**
   * Registrar nuevo usuario
   * POST /api/auth/register
   */
  async register(req, res, next) {
    try {
      const result = await authService.register(req.body);
      
      return successResponse(
        res,
        201,
        'Usuario registrado exitosamente',
        result
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Login de usuario
   * POST /api/auth/login
   */
  async login(req, res, next) {
    try {
      const result = await authService.login(req.body);
      
      return successResponse(
        res,
        200,
        'Login exitoso',
        result
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener perfil del usuario autenticado
   * GET /api/auth/profile
   */
  async getProfile(req, res, next) {
    try {
      const user = await authService.getProfile(req.user.id);
      
      return successResponse(
        res,
        200,
        'Perfil obtenido exitosamente',
        user
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();