import usuariosService from './usuarios.service.js';
import { successResponse } from '../../utils/response.util.js';

/**
 * Controlador de usuarios
 * Maneja las requests HTTP relacionadas con usuarios
 */
class UsuariosController {
  /**
   * Obtener todos los usuarios
   * GET /api/usuarios
   */
  async getAllUsers(req, res, next) {
    try {
      const result = await usuariosService.getAllUsers(req.query);
      
      return successResponse(
        res,
        200,
        'Usuarios obtenidos exitosamente',
        result
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener usuario por ID
   * GET /api/usuarios/:id
   */
  async getUserById(req, res, next) {
    try {
      const user = await usuariosService.getUserById(
        parseInt(req.params.id),
        req.user.id,
        req.user.role
      );
      
      return successResponse(
        res,
        200,
        'Usuario obtenido exitosamente',
        user
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Actualizar usuario
   * PUT /api/usuarios/:id
   */
  async updateUser(req, res, next) {
    try {
      const userId = parseInt(req.params.id);
      const user = await usuariosService.updateUser(
        userId,
        req.body,
        req.user.id,
        req.user.role
      );
      
      return successResponse(
        res,
        200,
        'Usuario actualizado exitosamente',
        user
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Desactivar usuario
   * DELETE /api/usuarios/:id
   */
  async deactivateUser(req, res, next) {
    try {
      const user = await usuariosService.deactivateUser(parseInt(req.params.id));
      
      return successResponse(
        res,
        200,
        'Usuario desactivado exitosamente',
        user
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reactivar usuario
   * PATCH /api/usuarios/:id/reactivate
   */
  async reactivateUser(req, res, next) {
    try {
      const user = await usuariosService.reactivateUser(parseInt(req.params.id));
      
      return successResponse(
        res,
        200,
        'Usuario reactivado exitosamente',
        user
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new UsuariosController();