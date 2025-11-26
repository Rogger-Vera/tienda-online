import ordenesRepository from './ordenes.repository.js';
import carritosRepository from '../carritos/carritos.repository.js';
import productosRepository from '../productos/productos.repository.js';
import prisma from '../../config/database.js';
import AppError from '../../utils/AppError.js';
import logger from '../../config/logger.js';

/**
 * Estados validos de orden
 */
const ESTADOS_ORDEN = {
  PENDIENTE: 'PENDIENTE',
  PAGADA: 'PAGADA',
  ENVIADA: 'ENVIADA',
  ENTREGADA: 'ENTREGADA',
  CANCELADA: 'CANCELADA',
};

/**
 * Servicio de ordenes
 * Contiene la logica de negocio para gestion de ordenes
 */
class OrdenesService {
  /**
   * Crear orden desde el carrito
   * @param {number} usuarioId - ID del usuario
   * @param {object} orderData - Datos adicionales de la orden
   * @returns {Promise<object>} Orden creada
   */
  async createOrder(usuarioId, orderData) {
    const { direccionEnvio, tasaImpuesto = 0 } = orderData;

    // Validar direccion de envio
    if (!direccionEnvio || direccionEnvio.trim().length < 10) {
      throw new AppError('Direccion de envio invalida', 400);
    }

    // Obtener carrito del usuario
    const carrito = await carritosRepository.findByUserId(usuarioId);

    if (!carrito || carrito.items.length === 0) {
      throw new AppError('El carrito esta vacio', 400);
    }

    // Usar transaccion para garantizar consistencia
    const orden = await prisma.$transaction(async (tx) => {
      // Verificar stock y productos activos
      for (const item of carrito.items) {
        const producto = await tx.producto.findUnique({
          where: { id: item.productoId },
        });

        if (!producto) {
          throw new AppError(`Producto ${item.producto.nombre} no encontrado`, 404);
        }

        if (!producto.isActive) {
          throw new AppError(`Producto ${item.producto.nombre} no esta disponible`, 400);
        }

        if (producto.stock < item.cantidad) {
          throw new AppError(
            `Stock insuficiente para ${item.producto.nombre}. Disponible: ${producto.stock}`,
            400
          );
        }
      }

      // Calcular totales
      let subtotal = 0;
      const ordenItems = [];

      for (const item of carrito.items) {
        const precioUnitario = parseFloat(item.producto.precio);
        const subtotalItem = precioUnitario * item.cantidad;
        subtotal += subtotalItem;

        ordenItems.push({
          productoId: item.productoId,
          nombreProducto: item.producto.nombre,
          precioUnitario: precioUnitario,
          cantidad: item.cantidad,
          subtotal: subtotalItem,
        });

        // Reducir stock del producto
        await tx.producto.update({
          where: { id: item.productoId },
          data: {
            stock: {
              decrement: item.cantidad,
            },
          },
        });
      }

      const impuestos = subtotal * tasaImpuesto;
      const total = subtotal + impuestos;

      // Generar numero de orden
      const numeroOrden = await ordenesRepository.generateOrderNumber();

      // Crear orden
      const nuevaOrden = await tx.orden.create({
        data: {
          numeroOrden,
          usuarioId,
          estado: ESTADOS_ORDEN.PENDIENTE,
          subtotal,
          impuestos,
          total,
          direccionEnvio,
          items: {
            create: ordenItems,
          },
        },
        include: {
          items: {
            include: {
              producto: {
                select: {
                  id: true,
                  nombre: true,
                  imagenUrl: true,
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

      // Vaciar carrito
      await tx.carritoItem.deleteMany({
        where: { carritoId: carrito.id },
      });

      return nuevaOrden;
    });

    logger.info(
      `Orden ${orden.numeroOrden} creada para usuario ${usuarioId}. Total: $${orden.total}`
    );

    return orden;
  }

  /**
   * Obtener ordenes del usuario
   * @param {number} usuarioId - ID del usuario
   * @param {object} query - Parametros de consulta
   * @returns {Promise<object>} Lista de ordenes con paginacion
   */
  async getUserOrders(usuarioId, query = {}) {
    const { page = 1, limit = 10, estado } = query;

    const skip = (page - 1) * limit;
    const take = parseInt(limit);

    const options = {
      skip,
      take,
      estado: estado || undefined,
    };

    const whereCount = { usuarioId };
    if (estado) whereCount.estado = estado;

    const [ordenes, total] = await Promise.all([
      ordenesRepository.findByUserId(usuarioId, options),
      ordenesRepository.count(whereCount),
    ]);

    return {
      ordenes,
      pagination: {
        page: parseInt(page),
        limit: take,
        total,
        totalPages: Math.ceil(total / take),
      },
    };
  }

  /**
   * Obtener todas las ordenes (admin)
   * @param {object} query - Parametros de consulta
   * @returns {Promise<object>} Lista de ordenes con paginacion
   */
  async getAllOrders(query = {}) {
    const { page = 1, limit = 10, estado, usuarioId } = query;

    const skip = (page - 1) * limit;
    const take = parseInt(limit);

    const options = {
      skip,
      take,
      estado: estado || undefined,
      usuarioId: usuarioId ? parseInt(usuarioId) : undefined,
    };

    const whereCount = {};
    if (estado) whereCount.estado = estado;
    if (usuarioId) whereCount.usuarioId = parseInt(usuarioId);

    const [ordenes, total] = await Promise.all([
      ordenesRepository.findAll(options),
      ordenesRepository.count(whereCount),
    ]);

    return {
      ordenes,
      pagination: {
        page: parseInt(page),
        limit: take,
        total,
        totalPages: Math.ceil(total / take),
      },
    };
  }

  /**
   * Obtener orden por ID
   * @param {number} id - ID de la orden
   * @param {number} usuarioId - ID del usuario que hace la peticion
   * @param {string} userRole - Rol del usuario
   * @returns {Promise<object>} Orden encontrada
   */
  async getOrderById(id, usuarioId, userRole) {
    const orden = await ordenesRepository.findById(id);

    if (!orden) {
      throw new AppError('Orden no encontrada', 404);
    }

    // Solo el dueño de la orden o un admin puede verla
    if (userRole !== 'ADMIN' && orden.usuarioId !== usuarioId) {
      throw new AppError('No tienes permisos para ver esta orden', 403);
    }

    return orden;
  }

  /**
   * Actualizar estado de la orden
   * @param {number} id - ID de la orden
   * @param {string} nuevoEstado - Nuevo estado
   * @returns {Promise<object>} Orden actualizada
   */
  async updateOrderStatus(id, nuevoEstado) {
    // Validar que el estado es valido
    if (!Object.values(ESTADOS_ORDEN).includes(nuevoEstado)) {
      throw new AppError(
        `Estado invalido. Estados validos: ${Object.values(ESTADOS_ORDEN).join(', ')}`,
        400
      );
    }

    const orden = await ordenesRepository.findById(id);

    if (!orden) {
      throw new AppError('Orden no encontrada', 404);
    }

    // Validar transiciones de estado
    this._validateStatusTransition(orden.estado, nuevoEstado);

    const ordenActualizada = await ordenesRepository.updateStatus(id, nuevoEstado);

    logger.info(`Orden ${orden.numeroOrden} cambio de estado: ${orden.estado} → ${nuevoEstado}`);

    return ordenActualizada;
  }

  /**
   * Cancelar orden
   * @param {number} id - ID de la orden
   * @param {number} usuarioId - ID del usuario
   * @param {string} userRole - Rol del usuario
   * @returns {Promise<object>} Orden cancelada
   */
  async cancelOrder(id, usuarioId, userRole) {
    const orden = await ordenesRepository.findById(id);

    if (!orden) {
      throw new AppError('Orden no encontrada', 404);
    }

    // Solo el dueño o un admin pueden cancelar
    if (userRole !== 'ADMIN' && orden.usuarioId !== usuarioId) {
      throw new AppError('No tienes permisos para cancelar esta orden', 403);
    }

    // Solo se puede cancelar si esta PENDIENTE o PAGADA
    if (![ESTADOS_ORDEN.PENDIENTE, ESTADOS_ORDEN.PAGADA].includes(orden.estado)) {
      throw new AppError(
        `No se puede cancelar una orden en estado ${orden.estado}`,
        400
      );
    }

    // Usar transaccion para devolver el stock
    const ordenCancelada = await prisma.$transaction(async (tx) => {
      // Devolver stock de los productos
      for (const item of orden.items) {
        await tx.producto.update({
          where: { id: item.productoId },
          data: {
            stock: {
              increment: item.cantidad,
            },
          },
        });
      }

      // Actualizar estado de la orden
      const ordenActualizada = await tx.orden.update({
        where: { id },
        data: { estado: ESTADOS_ORDEN.CANCELADA },
        include: {
          items: {
            include: {
              producto: {
                select: {
                  id: true,
                  nombre: true,
                  imagenUrl: true,
                },
              },
            },
          },
        },
      });

      return ordenActualizada;
    });

    logger.info(`Orden ${orden.numeroOrden} cancelada. Stock devuelto.`);

    return ordenCancelada;
  }

  /**
   * Validar transiciones de estado permitidas
   * @param {string} estadoActual - Estado actual
   * @param {string} nuevoEstado - Nuevo estado
   * @private
   */
  _validateStatusTransition(estadoActual, nuevoEstado) {
    const transicionesPermitidas = {
      PENDIENTE: [ESTADOS_ORDEN.PAGADA, ESTADOS_ORDEN.CANCELADA],
      PAGADA: [ESTADOS_ORDEN.ENVIADA, ESTADOS_ORDEN.CANCELADA],
      ENVIADA: [ESTADOS_ORDEN.ENTREGADA],
      ENTREGADA: [],
      CANCELADA: [],
    };

    const permitidas = transicionesPermitidas[estadoActual] || [];

    if (!permitidas.includes(nuevoEstado)) {
      throw new AppError(
        `No se puede cambiar de ${estadoActual} a ${nuevoEstado}`,
        400
      );
    }
  }

  /**
   * Obtener estadisticas de ordenes (admin)
   * @returns {Promise<object>} Estadisticas
   */
  async getOrderStatistics() {
    const [totalOrdenes, totalPorEstado, ventasTotales] = await Promise.all([
      prisma.orden.count(),
      prisma.orden.groupBy({
        by: ['estado'],
        _count: {
          id: true,
        },
      }),
      prisma.orden.aggregate({
        _sum: {
          total: true,
        },
        where: {
          estado: {
            in: [ESTADOS_ORDEN.PAGADA, ESTADOS_ORDEN.ENVIADA, ESTADOS_ORDEN.ENTREGADA],
          },
        },
      }),
    ]);

    const estadisticasPorEstado = {};
    totalPorEstado.forEach((item) => {
      estadisticasPorEstado[item.estado] = item._count.id;
    });

    return {
      totalOrdenes,
      estadisticasPorEstado,
      ventasTotales: parseFloat(ventasTotales._sum.total || 0),
    };
  }
}

export default new OrdenesService();