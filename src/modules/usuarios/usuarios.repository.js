import prisma from '../../config/database.js';

/**
 * Repositorio de usuarios
 * Maneja todas las operaciones de base de datos para usuarios
 */
class UsuariosRepository {
  /**
   * Obtener todos los usuarios
   * @param {object} options - Opciones de filtrado
   * @returns {Promise<Array>} Lista de usuarios
   */
  async findAll(options = {}) {
    const { isActive, roleId, skip = 0, take = 10, nombre } = options;

    const where = {};
    if (isActive !== undefined) where.isActive = isActive;
    if (roleId) where.roleId = roleId;
    if (nombre) {
      where.nombre = {
        contains: nombre,
      };
    }

    return await prisma.user.findMany({
      where,
      skip,
      take,
      select: {
        id: true,
        email: true,
        nombre: true,
        isActive: true,
        role: {
          select: {
            id: true,
            nombre: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Obtener usuario por ID
   * @param {number} id - ID del usuario
   * @returns {Promise<object>} Usuario encontrado
   */
  async findById(id) {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        nombre: true,
        isActive: true,
        role: {
          select: {
            id: true,
            nombre: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Obtener usuario por email
   * @param {string} email - Email del usuario
   * @returns {Promise<object>} Usuario encontrado
   */
  async findByEmail(email) {
    return await prisma.user.findUnique({
      where: { email },
      include: {
        role: true,
      },
    });
  }

  /**
   * Actualizar usuario
   * @param {number} id - ID del usuario
   * @param {object} data - Datos a actualizar
   * @returns {Promise<object>} Usuario actualizado
   */
  async update(id, data) {
    return await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        nombre: true,
        isActive: true,
        role: {
          select: {
            id: true,
            nombre: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Soft delete de usuario (desactivar)
   * @param {number} id - ID del usuario
   * @returns {Promise<object>} Usuario desactivado
   */
  async softDelete(id) {
    return await this.update(id, { isActive: false });
  }

  /**
   * Reactivar usuario
   * @param {number} id - ID del usuario
   * @returns {Promise<object>} Usuario reactivado
   */
  async reactivate(id) {
    return await this.update(id, { isActive: true });
  }

  /**
   * Contar usuarios
   * @param {object} where - Condiciones de filtrado
   * @returns {Promise<number>} Cantidad de usuarios
   */
  async count(where = {}) {
    return await prisma.user.count({ where });
  }
}

export default new UsuariosRepository();