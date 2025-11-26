import rolesRepository from './roles.repository.js';
import AppError from '../../utils/AppError.js';

/**
 * Servicio de roles
 * Contiene la logica de negocio para gestion de roles
 */
class RolesService {
  /**
   * Obtener todos los roles
   * @returns {Promise<Array>} Lista de roles
   */
  async getAllRoles() {
    return await rolesRepository.findAll();
  }

  /**
   * Obtener rol por ID
   * @param {number} id - ID del rol
   * @returns {Promise<object>} Rol encontrado
   */
  async getRoleById(id) {
    const role = await rolesRepository.findById(id);

    if (!role) {
      throw new AppError('Rol no encontrado', 404);
    }

    return role;
  }
}

export default new RolesService();