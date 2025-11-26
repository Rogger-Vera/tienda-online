import productosRepository from './productos.repository.js';
import categoriasRepository from '../categorias/categorias.repository.js';
import AppError from '../../utils/AppError.js';
import logger from '../../config/logger.js';

/**
 * Servicio de productos
 * Contiene la logica de negocio para gestion de productos
 */
class ProductosService {
  /**
   * Obtener todos los productos con paginacion y filtros
   * @param {object} query - Parametros de consulta
   * @returns {Promise<object>} Lista de productos y metadata
   */
  async getAllProductos(query = {}) {
    const { 
      page = 1, 
      limit = 20, 
      isActive, 
      categoriaId,
      minPrecio,
      maxPrecio,
      search,
      orderBy = 'createdAt',
      order = 'desc'
    } = query;
    
    const skip = (page - 1) * limit;
    const take = parseInt(limit);

    const options = {
      skip,
      take,
      isActive: isActive !== undefined ? isActive === 'true' : undefined,
      categoriaId: categoriaId ? parseInt(categoriaId) : undefined,
      minPrecio: minPrecio ? parseFloat(minPrecio) : undefined,
      maxPrecio: maxPrecio ? parseFloat(maxPrecio) : undefined,
      search: search || undefined,
      orderBy,
      order,
    };

    const whereCount = {};
    if (options.isActive !== undefined) whereCount.isActive = options.isActive;
    if (options.categoriaId) whereCount.categoriaId = options.categoriaId;
    if (options.minPrecio !== undefined || options.maxPrecio !== undefined) {
      whereCount.precio = {};
      if (options.minPrecio !== undefined) whereCount.precio.gte = options.minPrecio;
      if (options.maxPrecio !== undefined) whereCount.precio.lte = options.maxPrecio;
    }
    if (options.search) {
      whereCount.OR = [
        { nombre: { contains: options.search } },
        { descripcion: { contains: options.search } },
      ];
    }

    const [productos, total] = await Promise.all([
      productosRepository.findAll(options),
      productosRepository.count(whereCount),
    ]);

    return {
      productos,
      pagination: {
        page: parseInt(page),
        limit: take,
        total,
        totalPages: Math.ceil(total / take),
      },
      filters: {
        isActive: options.isActive,
        categoriaId: options.categoriaId,
        minPrecio: options.minPrecio,
        maxPrecio: options.maxPrecio,
        search: options.search,
      },
    };
  }

  /**
   * Obtener producto por ID
   * @param {number} id - ID del producto
   * @returns {Promise<object>} Producto encontrado
   */
  async getProductoById(id) {
    const producto = await productosRepository.findById(id);

    if (!producto) {
      throw new AppError('Producto no encontrado', 404);
    }

    return producto;
  }

  /**
   * Crear nuevo producto
   * @param {object} productoData - Datos del producto
   * @returns {Promise<object>} Producto creado
   */
  async createProducto(productoData) {
    const { nombre, descripcion, precio, stock, imagenUrl, categoriaId } = productoData;

    // Verificar que la categoria existe y esta activa
    const categoria = await categoriasRepository.findById(categoriaId);
    
    if (!categoria) {
      throw new AppError('Categoria no encontrada', 404);
    }

    if (!categoria.isActive) {
      throw new AppError('No se puede crear producto en una categoria inactiva', 400);
    }

    // Validar precio
    if (precio <= 0) {
      throw new AppError('El precio debe ser mayor a 0', 400);
    }

    // Validar stock
    if (stock < 0) {
      throw new AppError('El stock no puede ser negativo', 400);
    }

    const producto = await productosRepository.create({
      nombre,
      descripcion: descripcion || null,
      precio,
      stock: stock || 0,
      imagenUrl: imagenUrl || null,
      categoriaId,
    });

    logger.info(`Nuevo producto creado: ${nombre} (ID: ${producto.id})`);

    return producto;
  }

  /**
   * Actualizar producto
   * @param {number} id - ID del producto
   * @param {object} updateData - Datos a actualizar
   * @returns {Promise<object>} Producto actualizado
   */
  async updateProducto(id, updateData) {
    const producto = await productosRepository.findById(id);

    if (!producto) {
      throw new AppError('Producto no encontrado', 404);
    }

    const dataToUpdate = {};

    if (updateData.nombre !== undefined) {
      dataToUpdate.nombre = updateData.nombre;
    }

    if (updateData.descripcion !== undefined) {
      dataToUpdate.descripcion = updateData.descripcion;
    }

    if (updateData.precio !== undefined) {
      if (updateData.precio <= 0) {
        throw new AppError('El precio debe ser mayor a 0', 400);
      }
      dataToUpdate.precio = updateData.precio;
    }

    if (updateData.stock !== undefined) {
      if (updateData.stock < 0) {
        throw new AppError('El stock no puede ser negativo', 400);
      }
      dataToUpdate.stock = updateData.stock;
    }

    if (updateData.imagenUrl !== undefined) {
      dataToUpdate.imagenUrl = updateData.imagenUrl;
    }

    if (updateData.categoriaId !== undefined) {
      // Verificar que la nueva categoria existe y esta activa
      const categoria = await categoriasRepository.findById(updateData.categoriaId);
      
      if (!categoria) {
        throw new AppError('Categoria no encontrada', 404);
      }

      if (!categoria.isActive) {
        throw new AppError('No se puede asignar una categoria inactiva', 400);
      }

      dataToUpdate.categoriaId = updateData.categoriaId;
    }

    if (updateData.isActive !== undefined) {
      dataToUpdate.isActive = updateData.isActive;
    }

    const updatedProducto = await productosRepository.update(id, dataToUpdate);

    logger.info(`Producto actualizado: ${updatedProducto.nombre} (ID: ${id})`);

    return updatedProducto;
  }

  /**
   * Desactivar producto (soft delete)
   * @param {number} id - ID del producto
   * @returns {Promise<object>} Producto desactivado
   */
  async deactivateProducto(id) {
    const producto = await productosRepository.findById(id);

    if (!producto) {
      throw new AppError('Producto no encontrado', 404);
    }

    if (!producto.isActive) {
      throw new AppError('El producto ya esta inactivo', 400);
    }

    const deactivatedProducto = await productosRepository.softDelete(id);

    logger.info(`Producto desactivado: ${deactivatedProducto.nombre} (ID: ${id})`);

    return deactivatedProducto;
  }

  /**
   * Reactivar producto
   * @param {number} id - ID del producto
   * @returns {Promise<object>} Producto reactivado
   */
  async reactivateProducto(id) {
    const producto = await productosRepository.findById(id);

    if (!producto) {
      throw new AppError('Producto no encontrado', 404);
    }

    if (producto.isActive) {
      throw new AppError('El producto ya esta activo', 400);
    }

    // Verificar que la categoria esta activa
    if (!producto.categoria.isActive) {
      throw new AppError('No se puede reactivar un producto con categoria inactiva', 400);
    }

    const reactivatedProducto = await productosRepository.reactivate(id);

    logger.info(`Producto reactivado: ${reactivatedProducto.nombre} (ID: ${id})`);

    return reactivatedProducto;
  }

  /**
   * Actualizar stock de producto
   * @param {number} id - ID del producto
   * @param {number} cantidad - Cantidad a agregar o quitar (puede ser negativo)
   * @returns {Promise<object>} Producto con stock actualizado
   */
  async updateStock(id, cantidad) {
    const producto = await productosRepository.findById(id);

    if (!producto) {
      throw new AppError('Producto no encontrado', 404);
    }

    // Verificar que no quedara en stock negativo
    const nuevoStock = producto.stock + cantidad;
    
    if (nuevoStock < 0) {
      throw new AppError('No hay suficiente stock disponible', 400);
    }

    const updatedProducto = await productosRepository.updateStock(id, cantidad);

    logger.info(`Stock actualizado para producto ${producto.nombre}: ${producto.stock} → ${nuevoStock}`);

    return updatedProducto;
  }

  /**
   * Verificar disponibilidad de stock
   * @param {number} id - ID del producto
   * @param {number} cantidadRequerida - Cantidad requerida
   * @returns {Promise<object>} Informacion de disponibilidad
   */
  async checkStock(id, cantidadRequerida) {
    const producto = await productosRepository.findById(id);

    if (!producto) {
      throw new AppError('Producto no encontrado', 404);
    }

    const disponible = producto.stock >= cantidadRequerida;

    return {
      productoId: id,
      productoNombre: producto.nombre,
      stockActual: producto.stock,
      cantidadRequerida,
      disponible,
      stockRestante: disponible ? producto.stock - cantidadRequerida : 0,
    };
  }
}

export default new ProductosService();