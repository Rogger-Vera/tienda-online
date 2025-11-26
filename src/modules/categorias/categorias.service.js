import categoriasRepository from './categorias.repository.js';
import AppError from '../../utils/AppError.js';
import logger from '../../config/logger.js';

/**
 * Servicio de categorias
 * Contiene la logica de negocio para gestion de categorias
 */
class CategoriasService {
  /**
   * Obtener todas las categorias con paginacion
   * @param {object} query - Parametros de consulta
   * @returns {Promise<object>} Lista de categorias y metadata
   */
  async getAllCategorias(query = {}) {
    const { page = 1, limit = 50, isActive } = query;
    
    const skip = (page - 1) * limit;
    const take = parseInt(limit);

    const options = {
      skip,
      take,
      isActive: isActive !== undefined ? isActive === 'true' : undefined,
    };

    const [categorias, total] = await Promise.all([
      categoriasRepository.findAll(options),
      categoriasRepository.count({
        isActive: options.isActive,
      }),
    ]);

    return {
      categorias,
      pagination: {
        page: parseInt(page),
        limit: take,
        total,
        totalPages: Math.ceil(total / take),
      },
    };
  }

  /**
   * Obtener categoria por ID
   * @param {number} id - ID de la categoria
   * @returns {Promise<object>} Categoria encontrada
   */
  async getCategoriaById(id) {
    const categoria = await categoriasRepository.findById(id);

    if (!categoria) {
      throw new AppError('Categoria no encontrada', 404);
    }

    return categoria;
  }

  /**
   * Crear nueva categoria
   * @param {object} categoriaData - Datos de la categoria
   * @returns {Promise<object>} Categoria creada
   */
  async createCategoria(categoriaData) {
    const { nombre, descripcion } = categoriaData;

    // Verificar si la categoria ya existe
    const existingCategoria = await categoriasRepository.findByName(nombre);

    if (existingCategoria) {
      throw new AppError('Ya existe una categoria con ese nombre', 409);
    }

    const categoria = await categoriasRepository.create({
      nombre,
      descripcion: descripcion || null,
    });

    logger.info(`Nueva categoria creada: ${nombre}`);

    return categoria;
  }

  /**
   * Actualizar categoria
   * @param {number} id - ID de la categoria
   * @param {object} updateData - Datos a actualizar
   * @returns {Promise<object>} Categoria actualizada
   */
  async updateCategoria(id, updateData) {
    const categoria = await categoriasRepository.findById(id);

    if (!categoria) {
      throw new AppError('Categoria no encontrada', 404);
    }

    // Si se actualiza el nombre, verificar que no exista otro con ese nombre
    if (updateData.nombre && updateData.nombre !== categoria.nombre) {
      const existingCategoria = await categoriasRepository.findByName(updateData.nombre);
      
      if (existingCategoria) {
        throw new AppError('Ya existe una categoria con ese nombre', 409);
      }
    }

    const dataToUpdate = {};
    if (updateData.nombre) dataToUpdate.nombre = updateData.nombre;
    if (updateData.descripcion !== undefined) dataToUpdate.descripcion = updateData.descripcion;
    if (updateData.isActive !== undefined) dataToUpdate.isActive = updateData.isActive;

    const updatedCategoria = await categoriasRepository.update(id, dataToUpdate);

    logger.info(`Categoria actualizada: ${updatedCategoria.nombre}`);

    return updatedCategoria;
  }

  /**
   * Desactivar categoria (soft delete)
   * @param {number} id - ID de la categoria
   * @returns {Promise<object>} Categoria desactivada
   */
  async deactivateCategoria(id) {
    const categoria = await categoriasRepository.findById(id);

    if (!categoria) {
      throw new AppError('Categoria no encontrada', 404);
    }

    if (!categoria.isActive) {
      throw new AppError('La categoria ya esta inactiva', 400);
    }

    // Verificar si tiene productos activos
    const hasProducts = await categoriasRepository.hasProducts(id);
    
    if (hasProducts) {
      throw new AppError(
        'No se puede desactivar la categoria porque tiene productos asociados. Desactiva los productos primero.',
        400
      );
    }

    const deactivatedCategoria = await categoriasRepository.softDelete(id);

    logger.info(`Categoria desactivada: ${deactivatedCategoria.nombre}`);

    return deactivatedCategoria;
  }

  /**
   * Reactivar categoria
   * @param {number} id - ID de la categoria
   * @returns {Promise<object>} Categoria reactivada
   */
  async reactivateCategoria(id) {
    const categoria = await categoriasRepository.findById(id);

    if (!categoria) {
      throw new AppError('Categoria no encontrada', 404);
    }

    if (categoria.isActive) {
      throw new AppError('La categoria ya esta activa', 400);
    }

    const reactivatedCategoria = await categoriasRepository.reactivate(id);

    logger.info(`Categoria reactivada: ${reactivatedCategoria.nombre}`);

    return reactivatedCategoria;
  }
}

export default new CategoriasService();
