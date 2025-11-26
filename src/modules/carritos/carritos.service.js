import carritosRepository from './carritos.repository.js';
import productosRepository from '../productos/productos.repository.js';
import AppError from '../../utils/AppError.js';
import logger from '../../config/logger.js';

/**
 * Servicio de carritos
 * Contiene la logica de negocio para gestion de carritos
 */
class CarritosService {
  /**
   * Obtener o crear carrito del usuario
   * @param {number} usuarioId - ID del usuario
   * @returns {Promise<object>} Carrito con items y totales calculados
   */
  async getOrCreateCart(usuarioId) {
    let carrito = await carritosRepository.findByUserId(usuarioId);

    // Si no existe, crear uno nuevo
    if (!carrito) {
      carrito = await carritosRepository.create(usuarioId);
      carrito = await carritosRepository.findByUserId(usuarioId);
    }

    // Calcular totales
    return this._calculateCartTotals(carrito);
  }

  /**
   * Agregar producto al carrito
   * @param {number} usuarioId - ID del usuario
   * @param {number} productoId - ID del producto
   * @param {number} cantidad - Cantidad a agregar
   * @returns {Promise<object>} Carrito actualizado
   */
  async addItemToCart(usuarioId, productoId, cantidad) {
    // Verificar que el producto existe y esta activo
    const producto = await productosRepository.findById(productoId);

    if (!producto) {
      throw new AppError('Producto no encontrado', 404);
    }

    if (!producto.isActive) {
      throw new AppError('El producto no esta disponible', 400);
    }

    // Verificar stock disponible
    if (producto.stock < cantidad) {
      throw new AppError(
        `Stock insuficiente. Solo hay ${producto.stock} unidades disponibles`,
        400
      );
    }

    // Obtener o crear carrito
    let carrito = await carritosRepository.findByUserId(usuarioId);
    if (!carrito) {
      carrito = await carritosRepository.create(usuarioId);
    }

    // Verificar si el producto ya esta en el carrito
    const existingItem = await carritosRepository.findItem(carrito.id, productoId);

    if (existingItem) {
      // Si ya existe, actualizar cantidad
      const nuevaCantidad = existingItem.cantidad + cantidad;

      // Verificar que no exceda el stock
      if (nuevaCantidad > producto.stock) {
        throw new AppError(
          `No se puede agregar. Stock maximo: ${producto.stock}. Ya tienes ${existingItem.cantidad} en el carrito`,
          400
        );
      }

      await carritosRepository.updateItemQuantity(existingItem.id, nuevaCantidad);
    } else {
      // Si no existe, agregar nuevo item
      await carritosRepository.addItem(carrito.id, productoId, cantidad);
    }

    logger.info(
      `Usuario ${usuarioId} agrego ${cantidad} unidades del producto ${productoId} al carrito`
    );

    // Obtener carrito actualizado con totales
    return await this.getOrCreateCart(usuarioId);
  }

  /**
   * Actualizar cantidad de un item en el carrito
   * @param {number} usuarioId - ID del usuario
   * @param {number} productoId - ID del producto
   * @param {number} cantidad - Nueva cantidad
   * @returns {Promise<object>} Carrito actualizado
   */
  async updateItemQuantity(usuarioId, productoId, cantidad) {
    const carrito = await carritosRepository.findByUserId(usuarioId);

    if (!carrito) {
      throw new AppError('Carrito no encontrado', 404);
    }

    const item = await carritosRepository.findItem(carrito.id, productoId);

    if (!item) {
      throw new AppError('El producto no esta en el carrito', 404);
    }

    // Verificar stock disponible
    const producto = await productosRepository.findById(productoId);

    if (cantidad > producto.stock) {
      throw new AppError(
        `Stock insuficiente. Solo hay ${producto.stock} unidades disponibles`,
        400
      );
    }

    if (cantidad <= 0) {
      throw new AppError('La cantidad debe ser mayor a 0', 400);
    }

    await carritosRepository.updateItemQuantity(item.id, cantidad);

    logger.info(
      `Usuario ${usuarioId} actualizo cantidad del producto ${productoId} a ${cantidad}`
    );

    return await this.getOrCreateCart(usuarioId);
  }

  /**
   * Eliminar item del carrito
   * @param {number} usuarioId - ID del usuario
   * @param {number} productoId - ID del producto
   * @returns {Promise<object>} Carrito actualizado
   */
  async removeItemFromCart(usuarioId, productoId) {
    const carrito = await carritosRepository.findByUserId(usuarioId);

    if (!carrito) {
      throw new AppError('Carrito no encontrado', 404);
    }

    const item = await carritosRepository.findItem(carrito.id, productoId);

    if (!item) {
      throw new AppError('El producto no esta en el carrito', 404);
    }

    await carritosRepository.removeItem(item.id);

    logger.info(`Usuario ${usuarioId} elimino el producto ${productoId} del carrito`);

    return await this.getOrCreateCart(usuarioId);
  }

  /**
   * Vaciar carrito
   * @param {number} usuarioId - ID del usuario
   * @returns {Promise<object>} Carrito vacio
   */
  async clearCart(usuarioId) {
    const carrito = await carritosRepository.findByUserId(usuarioId);

    if (!carrito) {
      throw new AppError('Carrito no encontrado', 404);
    }

    await carritosRepository.clearCart(carrito.id);

    logger.info(`Usuario ${usuarioId} vacio su carrito`);

    return await this.getOrCreateCart(usuarioId);
  }

  /**
   * Calcular totales del carrito
   * @param {object} carrito - Carrito con items
   * @returns {object} Carrito con totales calculados
   * @private
   */
  _calculateCartTotals(carrito) {
    let subtotal = 0;
    let cantidadTotal = 0;

    const itemsConSubtotal = carrito.items.map((item) => {
      const subtotalItem = parseFloat(item.producto.precio) * item.cantidad;
      subtotal += subtotalItem;
      cantidadTotal += item.cantidad;

      return {
        ...item,
        subtotal: subtotalItem,
      };
    });

    return {
      id: carrito.id,
      usuarioId: carrito.usuarioId,
      items: itemsConSubtotal,
      cantidadTotal,
      subtotal: parseFloat(subtotal.toFixed(2)),
      createdAt: carrito.createdAt,
      updatedAt: carrito.updatedAt,
    };
  }
}

export default new CarritosService();