import prisma from '../../config/database.js';

/**
 * Repositorio de roles
 * Maneja todas las operaciones de base de datos para roles
 */
class RolesRepository {
  /**
   * Obtener todos los roles
   * @returns {Promise<Array>} Lista de roles
   */
  async findAll() {
    return await prisma.role.findMany({
      orderBy: {
        nombre: 'asc',
      },
    });
  }

  /**
   * Obtener rol por ID
   * @param {number} id - ID del rol
   * @returns {Promise<object>} Rol encontrado
   */
  async findById(id) {
    return await prisma.role.findUnique({
      where: { id },
    });
  }

  /**
   * Obtener rol por nombre
   * @param {string} nombre - Nombre del rol
   * @returns {Promise<object>} Rol encontrado
   */
  async findByName(nombre) {
    return await prisma.role.findUnique({
      where: { nombre },
    });
  }
}

export default new RolesRepository();