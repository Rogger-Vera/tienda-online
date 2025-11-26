import prisma from '../../config/database.js';

/**
 * Repositorio de carritos
 * Maneja todas las operaciones de base de datos para carritos
 */
class CarritosRepository {
  /**
   * Obtener carrito del usuario con sus items
   * @param {number} usuarioId - ID del usuario
   * @returns {Promise<object>} Carrito con items
   */
  async findByUserId(usuarioId) {
    return await prisma.carrito.findUnique({
      where: { usuarioId },
      include: {
        items: {
          include: {
            producto: {
              select: {
                id: true,
                nombre: true,
                descripcion: true,
                precio: true,
                stock: true,
                imagenUrl: true,
                isActive: true,
                categoria: {
                  select: {
                    id: true,
                    nombre: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  /**
   * Crear carrito para un usuario
   * @param {number} usuarioId - ID del usuario
   * @returns {Promise<object>} Carrito creado
   */
  async create(usuarioId) {
    return await prisma.carrito.create({
      data: {
        usuarioId,
      },
      include: {
        items: true,
      },
    });
  }

  /**
   * Agregar item al carrito
   * @param {number} carritoId - ID del carrito
   * @param {number} productoId - ID del producto
   * @param {number} cantidad - Cantidad del producto
   * @returns {Promise<object>} Item creado
   */
  async addItem(carritoId, productoId, cantidad) {
    return await prisma.carritoItem.create({
      data: {
        carritoId,
        productoId,
        cantidad,
      },
      include: {
        producto: {
          select: {
            id: true,
            nombre: true,
            precio: true,
            stock: true,
            imagenUrl: true,
            isActive: true,
          },
        },
      },
    });
  }

  /**
   * Obtener item especifico del carrito
   * @param {number} carritoId - ID del carrito
   * @param {number} productoId - ID del producto
   * @returns {Promise<object>} Item encontrado
   */
  async findItem(carritoId, productoId) {
    return await prisma.carritoItem.findUnique({
      where: {
        carritoId_productoId: {
          carritoId,
          productoId,
        },
      },
    });
  }

  /**
   * Actualizar cantidad de un item
   * @param {number} itemId - ID del item
   * @param {number} cantidad - Nueva cantidad
   * @returns {Promise<object>} Item actualizado
   */
  async updateItemQuantity(itemId, cantidad) {
    return await prisma.carritoItem.update({
      where: { id: itemId },
      data: { cantidad },
      include: {
        producto: {
          select: {
            id: true,
            nombre: true,
            precio: true,
            stock: true,
            imagenUrl: true,
          },
        },
      },
    });
  }

  /**
   * Eliminar item del carrito
   * @param {number} itemId - ID del item
   * @returns {Promise<object>} Item eliminado
   */
  async removeItem(itemId) {
    return await prisma.carritoItem.delete({
      where: { id: itemId },
    });
  }

  /**
   * Vaciar carrito (eliminar todos los items)
   * @param {number} carritoId - ID del carrito
   * @returns {Promise<object>} Resultado de la operacion
   */
  async clearCart(carritoId) {
    return await prisma.carritoItem.deleteMany({
      where: { carritoId },
    });
  }

  /**
   * Obtener cantidad total de items en el carrito
   * @param {number} carritoId - ID del carrito
   * @returns {Promise<number>} Cantidad total
   */
  async getItemsCount(carritoId) {
    const result = await prisma.carritoItem.aggregate({
      where: { carritoId },
      _sum: {
        cantidad: true,
      },
    });
    return result._sum.cantidad || 0;
  }
}

export default new CarritosRepository();