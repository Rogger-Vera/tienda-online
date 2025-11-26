import { validators } from '../../middlewares/validator.middleware.js';

/**
 * Validacion para crear producto
 */
export const validateCreateProducto = (data) => {
  const errors = [];

  // Validar nombre
  const nombreError = validators.required(data.nombre, 'Nombre');
  if (nombreError) {
    errors.push({ field: 'nombre', message: nombreError });
  } else if (typeof data.nombre !== 'string' || data.nombre.trim().length < 3) {
    errors.push({ field: 'nombre', message: 'Nombre debe tener al menos 3 caracteres' });
  }

  // Validar descripcion (opcional)
  if (data.descripcion !== undefined && data.descripcion !== null && typeof data.descripcion !== 'string') {
    errors.push({ field: 'descripcion', message: 'Descripcion debe ser texto' });
  }

  // Validar precio
  const precioError = validators.positiveNumber(data.precio, 'Precio');
  if (precioError) {
    errors.push({ field: 'precio', message: precioError });
  }

  // Validar stock
  if (data.stock !== undefined) {
    if (isNaN(data.stock) || data.stock < 0) {
      errors.push({ field: 'stock', message: 'Stock debe ser un numero mayor o igual a 0' });
    }
  }

  // Validar imagenUrl (opcional)
  if (data.imagenUrl !== undefined && data.imagenUrl !== null) {
    if (typeof data.imagenUrl !== 'string') {
      errors.push({ field: 'imagenUrl', message: 'imagenUrl debe ser texto' });
    } else if (data.imagenUrl.length > 500) {
      errors.push({ field: 'imagenUrl', message: 'imagenUrl no puede exceder 500 caracteres' });
    }
  }

  // Validar categoriaId
  const categoriaError = validators.positiveInteger(data.categoriaId, 'categoriaId');
  if (categoriaError) {
    errors.push({ field: 'categoriaId', message: categoriaError });
  }

  return errors;
};

/**
 * Validacion para actualizar producto
 */
export const validateUpdateProducto = (data) => {
  const errors = [];

  // Validar nombre (opcional)
  if (data.nombre !== undefined) {
    if (typeof data.nombre !== 'string' || data.nombre.trim().length < 3) {
      errors.push({ field: 'nombre', message: 'Nombre debe tener al menos 3 caracteres' });
    }
  }

  // Validar descripcion (opcional)
  if (data.descripcion !== undefined && data.descripcion !== null && typeof data.descripcion !== 'string') {
    errors.push({ field: 'descripcion', message: 'Descripcion debe ser texto' });
  }

  // Validar precio (opcional)
  if (data.precio !== undefined) {
    const precioError = validators.positiveNumber(data.precio, 'Precio');
    if (precioError) {
      errors.push({ field: 'precio', message: precioError });
    }
  }

  // Validar stock (opcional)
  if (data.stock !== undefined) {
    if (isNaN(data.stock) || data.stock < 0) {
      errors.push({ field: 'stock', message: 'Stock debe ser un numero mayor o igual a 0' });
    }
  }

  // Validar imagenUrl (opcional)
  if (data.imagenUrl !== undefined && data.imagenUrl !== null) {
    if (typeof data.imagenUrl !== 'string') {
      errors.push({ field: 'imagenUrl', message: 'imagenUrl debe ser texto' });
    } else if (data.imagenUrl.length > 500) {
      errors.push({ field: 'imagenUrl', message: 'imagenUrl no puede exceder 500 caracteres' });
    }
  }

  // Validar categoriaId (opcional)
  if (data.categoriaId !== undefined) {
    const categoriaError = validators.positiveInteger(data.categoriaId, 'categoriaId');
    if (categoriaError) {
      errors.push({ field: 'categoriaId', message: categoriaError });
    }
  }

  // Validar isActive (opcional)
  if (data.isActive !== undefined && typeof data.isActive !== 'boolean') {
    errors.push({ field: 'isActive', message: 'isActive debe ser booleano' });
  }

  return errors;
};

/**
 * Validacion para actualizar stock
 */
export const validateUpdateStock = (data) => {
  const errors = [];

  const cantidadError = validators.required(data.cantidad, 'Cantidad');
  if (cantidadError) {
    errors.push({ field: 'cantidad', message: cantidadError });
  } else if (isNaN(data.cantidad) || !Number.isInteger(Number(data.cantidad))) {
    errors.push({ field: 'cantidad', message: 'Cantidad debe ser un numero entero' });
  }

  return errors;
};