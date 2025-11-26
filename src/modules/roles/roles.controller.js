import rolesService from './roles.service.js';
import { successResponse } from '../../utils/response.util.js';

/**
 * Controlador de roles
 * Maneja las requests HTTP relacionadas con roles
 */
class RolesController {
  /**
   * Obtener todos los roles
   * GET /api/roles
   */
  async getAllRoles(req, res, next) {
    try {
      const roles = await rolesService.getAllRoles();
      
      return successResponse(
        res,
        200,
        'Roles obtenidos exitosamente',
        roles
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener rol por ID
   * GET /api/roles/:id
   */
  async getRoleById(req, res, next) {
    try {
      const role = await rolesService.getRoleById(parseInt(req.params.id));
      
      return successResponse(
        res,
        200,
        'Rol obtenido exitosamente',
        role
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new RolesController();