import prisma from '../../config/database.js';

/**
 * Repositorio de productos
 * Maneja todas las operaciones de base de datos para productos
 */
class ProductosRepository {
  /**
   * Obtener todos los productos
   * @param {object} options - Opciones de filtrado
   * @returns {Promise<Array>} Lista de productos
   */
  async findAll(options = {}) {
    const { 
      isActive, 
      categoriaId, 
      minPrecio, 
      maxPrecio,
      search,
      skip = 0, 
      take = 20,
      orderBy = 'createdAt',
      order = 'desc'
    } = options;

    const where = {};
    
    if (isActive !== undefined) where.isActive = isActive;
    if (categoriaId) where.categoriaId = categoriaId;
    
    // Filtro por rango de precios
    if (minPrecio !== undefined || maxPrecio !== undefined) {
      where.precio = {};
      if (minPrecio !== undefined) where.precio.gte = minPrecio;
      if (maxPrecio !== undefined) where.precio.lte = maxPrecio;
    }

    // Busqueda por nombre o descripcion
    if (search) {
      where.OR = [
        { nombre: { contains: search } },
        { descripcion: { contains: search } },
      ];
    }

    return await prisma.producto.findMany({
      where,
      skip,
      take,
      include: {
        categoria: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
      orderBy: {
        [orderBy]: order,
      },
    });
  }

  /**
   * Obtener producto por ID
   * @param {number} id - ID del producto
   * @returns {Promise<object>} Producto encontrado
   */
  async findById(id) {
    return await prisma.producto.findUnique({
      where: { id },
      include: {
        categoria: {
          select: {
            id: true,
            nombre: true,
            descripcion: true,
          },
        },
      },
    });
  }

  /**
   * Crear producto
   * @param {object} data - Datos del producto
   * @returns {Promise<object>} Producto creado
   */
  async create(data) {
    return await prisma.producto.create({
      data,
      include: {
        categoria: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
    });
  }

  /**
   * Actualizar producto
   * @param {number} id - ID del producto
   * @param {object} data - Datos a actualizar
   * @returns {Promise<object>} Producto actualizado
   */
  async update(id, data) {
    return await prisma.producto.update({
      where: { id },
      data,
      include: {
        categoria: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
    });
  }

  /**
   * Eliminar producto (soft delete)
   * @param {number} id - ID del producto
   * @returns {Promise<object>} Producto desactivado
   */
  async softDelete(id) {
    return await this.update(id, { isActive: false });
  }

  /**
   * Reactivar producto
   * @param {number} id - ID del producto
   * @returns {Promise<object>} Producto reactivado
   */
  async reactivate(id) {
    return await this.update(id, { isActive: true });
  }

  /**
   * Contar productos
   * @param {object} where - Condiciones de filtrado
   * @returns {Promise<number>} Cantidad de productos
   */
  async count(where = {}) {
    return await prisma.producto.count({ where });
  }

  /**
   * Actualizar stock de producto
   * @param {number} id - ID del producto
   * @param {number} cantidad - Cantidad a incrementar/decrementar
   * @returns {Promise<object>} Producto actualizado
   */
  async updateStock(id, cantidad) {
    return await prisma.producto.update({
      where: { id },
      data: {
        stock: {
          increment: cantidad,
        },
      },
    });
  }

  /**
   * Verificar si hay stock disponible
   * @param {number} id - ID del producto
   * @param {number} cantidadRequerida - Cantidad requerida
   * @returns {Promise<boolean>} True si hay stock suficiente
   */
  async hasStock(id, cantidadRequerida) {
    const producto = await prisma.producto.findUnique({
      where: { id },
      select: { stock: true },
    });
    
    return producto && producto.stock >= cantidadRequerida;
  }
}

export default new ProductosRepository();