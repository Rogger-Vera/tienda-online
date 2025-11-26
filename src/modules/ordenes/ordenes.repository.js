import prisma from '../../config/database.js';

/**
 * Repositorio de ordenes
 * Maneja todas las operaciones de base de datos para ordenes
 */
class OrdenesRepository {
  /**
   * Crear orden con sus items
   * @param {object} data - Datos de la orden
   * @returns {Promise<object>} Orden creada
   */
  async create(data) {
    return await prisma.orden.create({
      data: {
        numeroOrden: data.numeroOrden,
        usuarioId: data.usuarioId,
        estado: data.estado || 'PENDIENTE',
        subtotal: data.subtotal,
        impuestos: data.impuestos,
        total: data.total,
        direccionEnvio: data.direccionEnvio,
        items: {
          create: data.items,
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
  }

  /**
   * Obtener todas las ordenes de un usuario
   * @param {number} usuarioId - ID del usuario
   * @param {object} options - Opciones de paginacion y filtrado
   * @returns {Promise<Array>} Lista de ordenes
   */
  async findByUserId(usuarioId, options = {}) {
    const { skip = 0, take = 10, estado } = options;

    const where = { usuarioId };
    if (estado) where.estado = estado;

    return await prisma.orden.findMany({
      where,
      skip,
      take,
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
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Obtener todas las ordenes (admin)
   * @param {object} options - Opciones de filtrado
   * @returns {Promise<Array>} Lista de ordenes
   */
  async findAll(options = {}) {
    const { skip = 0, take = 10, estado, usuarioId } = options;

    const where = {};
    if (estado) where.estado = estado;
    if (usuarioId) where.usuarioId = usuarioId;

    return await prisma.orden.findMany({
      where,
      skip,
      take,
      include: {
        usuario: {
          select: {
            id: true,
            email: true,
            nombre: true,
          },
        },
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
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Obtener orden por ID
   * @param {number} id - ID de la orden
   * @returns {Promise<object>} Orden encontrada
   */
  async findById(id) {
    return await prisma.orden.findUnique({
      where: { id },
      include: {
        usuario: {
          select: {
            id: true,
            email: true,
            nombre: true,
          },
        },
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
  }

  /**
   * Obtener orden por numero de orden
   * @param {string} numeroOrden - Numero de orden
   * @returns {Promise<object>} Orden encontrada
   */
  async findByNumeroOrden(numeroOrden) {
    return await prisma.orden.findUnique({
      where: { numeroOrden },
      include: {
        items: true,
      },
    });
  }

  /**
   * Actualizar estado de la orden
   * @param {number} id - ID de la orden
   * @param {string} estado - Nuevo estado
   * @returns {Promise<object>} Orden actualizada
   */
  async updateStatus(id, estado) {
    return await prisma.orden.update({
      where: { id },
      data: { estado },
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
  }

  /**
   * Contar ordenes
   * @param {object} where - Condiciones de filtrado
   * @returns {Promise<number>} Cantidad de ordenes
   */
  async count(where = {}) {
    return await prisma.orden.count({ where });
  }

  /**
   * Generar numero de orden unico
   * @returns {Promise<string>} Numero de orden
   */
  async generateOrderNumber() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    // Contar ordenes del dia
    const startOfDay = new Date(year, date.getMonth(), day);
    const endOfDay = new Date(year, date.getMonth(), day + 1);

    const count = await prisma.orden.count({
      where: {
        createdAt: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
    });

    const orderNumber = `ORD-${year}${month}${day}-${String(count + 1).padStart(4, '0')}`;
    return orderNumber;
  }
}

export default new OrdenesRepository();