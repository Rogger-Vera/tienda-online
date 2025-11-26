import prisma from '../../config/database.js';

/**
 * Repositorio de categorias
 * Maneja todas las operaciones de base de datos para categorias
 */
class CategoriasRepository {
  /**
   * Obtener todas las categorias
   * @param {object} options - Opciones de filtrado
   * @returns {Promise<Array>} Lista de categorias
   */
  async findAll(options = {}) {
    const { isActive, skip = 0, take = 50 } = options;

    const where = {};
    if (isActive !== undefined) where.isActive = isActive;

    return await prisma.categoria.findMany({
      where,
      skip,
      take,
      orderBy: {
        nombre: 'asc',
      },
    });
  }

  /**
   * Obtener categoria por ID
   * @param {number} id - ID de la categoria
   * @returns {Promise<object>} Categoria encontrada
   */
  async findById(id) {
    return await prisma.categoria.findUnique({
      where: { id },
      include: {
        _count: {
          select: { productos: true }, // Contar productos
        },
      },
    });
  }

  /**
   * Obtener categoria por nombre
   * @param {string} nombre - Nombre de la categoria
   * @returns {Promise<object>} Categoria encontrada
   */
  async findByName(nombre) {
    return await prisma.categoria.findUnique({
      where: { nombre },
    });
  }

  /**
   * Crear categoria
   * @param {object} data - Datos de la categoria
   * @returns {Promise<object>} Categoria creada
   */
  async create(data) {
    return await prisma.categoria.create({
      data,
    });
  }

  /**
   * Actualizar categoria
   * @param {number} id - ID de la categoria
   * @param {object} data - Datos a actualizar
   * @returns {Promise<object>} Categoria actualizada
   */
  async update(id, data) {
    return await prisma.categoria.update({
      where: { id },
      data,
    });
  }

  /**
   * Eliminar categoria (soft delete)
   * @param {number} id - ID de la categoria
   * @returns {Promise<object>} Categoria desactivada
   */
  async softDelete(id) {
    return await this.update(id, { isActive: false });
  }

  /**
   * Reactivar categoria
   * @param {number} id - ID de la categoria
   * @returns {Promise<object>} Categoria reactivada
   */
  async reactivate(id) {
    return await this.update(id, { isActive: true });
  }

  /**
   * Contar categorias
   * @param {object} where - Condiciones de filtrado
   * @returns {Promise<number>} Cantidad de categorias
   */
  async count(where = {}) {
    return await prisma.categoria.count({ where });
  }

  /**
   * Verificar si una categoria tiene productos asociados
   * @param {number} id - ID de la categoria
   * @returns {Promise<boolean>} True si tiene productos
   */
  async hasProducts(id) {
    const count = await prisma.producto.count({
      where: { categoriaId: id },
    });
    return count > 0;
  }
}

export default new CategoriasRepository();