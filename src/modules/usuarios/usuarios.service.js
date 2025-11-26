import usuariosRepository from './usuarios.repository.js';
import { hashPassword } from '../../utils/bcrypt.util.js';
import AppError from '../../utils/AppError.js';
import logger from '../../config/logger.js';

/**
 * Servicio de usuarios
 * Contiene la logica de negocio para gestion de usuarios
 */
class UsuariosService {
  /**
   * Obtener todos los usuarios con paginacion
   * @param {object} query - Parametros de consulta
   * @returns {Promise<object>} Lista de usuarios y metadata
   */
  async getAllUsers(query = {}) {
    const { page = 1, limit = 10, isActive, roleId, nombre } = query;
    
    const skip = (page - 1) * limit;
    const take = parseInt(limit);

    let nombreFilter = undefined;

    if (nombre) {
      if (nombre.length < 3) {
        logger.warn(`El nombre ${nombre} debe tener al menos 3 carcteres para buscar por nombre`)
        throw new AppError('El nombre debe tener al menos 3 caracteres para buscar.', 400);
      } 
      nombreFilter = nombre;
    }

    const options = {
      skip,
      take,
      isActive: isActive !== undefined ? isActive === 'true' : undefined,
      roleId: roleId ? parseInt(roleId) : undefined,
      nombre: nombreFilter,
    };

    const [users, total] = await Promise.all([
      usuariosRepository.findAll(options),
      usuariosRepository.count({
        isActive: options.isActive,
        roleId: options.roleId,
        ...(nombreFilter && {
          nombre: {
            contains: nombreFilter
          }
        }),
      }),
    ]);

    return {
      users,
      pagination: {
        page: parseInt(page),
        limit: take,
        total,
        totalPages: Math.ceil(total / take),
      },
    };
  }

  /**
   * Obtener usuario por ID
   * @param {number} id - ID del usuario
   * @param {number} requestUserId - ID del usuario que hace la request
   * @param {string} requestUserRole - Rol del usuario que hace la request
   * @returns {Promise<object>} Usuario encontrado
   */
  async getUserById(id, requestUserId, requestUserRole) {
    // Solo admin puede consultar otros usuarios
    // Un usuario puede consultar su propio perfil
    if (requestUserRole !== 'ADMIN' && requestUserId !== id) {
      throw new AppError('No tienes permisos para ver este usuario', 403);
    }

    const user = await usuariosRepository.findById(id);

    if (!user) {
      throw new AppError('Usuario no encontrado', 404);
    }

    return user;
  }

  /**
   * Actualizar usuario
   * @param {number} id - ID del usuario
   * @param {object} updateData - Datos a actualizar
   * @param {number} requestUserId - ID del usuario que hace la request
   * @param {string} requestUserRole - Rol del usuario que hace la request
   * @returns {Promise<object>} Usuario actualizado
   */
  async updateUser(id, updateData, requestUserId, requestUserRole) {
    const user = await usuariosRepository.findById(id);
    console.log('request Role: ', requestUserRole)
    if (!user) {
      throw new AppError('Usuario no encontrado', 404);
    }

    // Solo admin puede actualizar otros usuarios
    // Un usuario puede actualizar su propio perfil
    if (requestUserRole !== 'ADMIN' && requestUserId !== id) {
      throw new AppError('No tienes permisos para actualizar este usuario', 403);
    }

    // Preparar datos para actualizar
    const dataToUpdate = {};

    if (updateData.nombre !== undefined) {
      dataToUpdate.nombre = updateData.nombre;
    }

    if (updateData.email) {
      // Verificar que el email no este en uso por otro usuario
      const existingUser = await usuariosRepository.findByEmail(updateData.email);
      if (existingUser && existingUser.id !== id) {
        throw new AppError('El email ya esta en uso', 409);
      }
      dataToUpdate.email = updateData.email;
    }

    if (updateData.password) {
      dataToUpdate.password = await hashPassword(updateData.password);
    }

    // Solo admin puede cambiar isActive
    if (updateData.isActive !== undefined && requestUserRole === 'ADMIN') {
      dataToUpdate.isActive = updateData.isActive;
    }

    const updatedUser = await usuariosRepository.update(id, dataToUpdate);

    logger.info(`Usuario actualizado: ${updatedUser.email} por usuario ${requestUserId}`);

    return updatedUser;
  }

  /**
   * Desactivar usuario (soft delete)
   * @param {number} id - ID del usuario
   * @returns {Promise<object>} Usuario desactivado
   */
  async deactivateUser(id) {
    const user = await usuariosRepository.findById(id);

    if (!user) {
      throw new AppError('Usuario no encontrado', 404);
    }

    if (!user.isActive) {
      throw new AppError('El usuario ya esta inactivo', 400);
    }

    const deactivatedUser = await usuariosRepository.softDelete(id);

    logger.info(`Usuario desactivado: ${deactivatedUser.email}`);

    return deactivatedUser;
  }

  /**
   * Reactivar usuario
   * @param {number} id - ID del usuario
   * @returns {Promise<object>} Usuario reactivado
   */
  async reactivateUser(id) {
    const user = await usuariosRepository.findById(id);

    if (!user) {
      throw new AppError('Usuario no encontrado', 404);
    }

    if (user.isActive) {
      throw new AppError('El usuario ya esta activo', 400);
    }

    const reactivatedUser = await usuariosRepository.reactivate(id);

    logger.info(`Usuario reactivado: ${reactivatedUser.email}`);

    return reactivatedUser;
  }
}

export default new UsuariosService();