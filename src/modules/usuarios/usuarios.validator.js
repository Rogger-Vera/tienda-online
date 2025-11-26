import { validators } from '../../middlewares/validator.middleware.js';

/**
 * Validacion para actualizacion de usuario
 */
export const validateUpdateUser = (data) => {
  const errors = [];

  if (data.email) {
    const emailError = validators.email(data.email);
    if (emailError) errors.push({ field: 'email', message: emailError });
  }

  if (data.password) {
    const passwordError = validators.password(data.password, 6);
    if (passwordError) errors.push({ field: 'password', message: passwordError });
  }

  if (data.nombre && typeof data.nombre !== 'string') {
    errors.push({ field: 'nombre', message: 'Nombre debe ser texto' });
  }

  if (data.isActive !== undefined && typeof data.isActive !== 'boolean') {
    errors.push({ field: 'isActive', message: 'isActive debe ser booleano' });
  }

  return errors;
};