import { validators } from '../../middlewares/validator.middleware.js';

/**
 * Validacion para registro de usuario
 */
export const validateRegister = (data) => {
  const errors = [];

  const emailError = validators.email(data.email);
  if (emailError) errors.push({ field: 'email', message: emailError });

  const passwordError = validators.password(data.password, 6);
  if (passwordError) errors.push({ field: 'password', message: passwordError });

  if (data.nombre && typeof data.nombre !== 'string') {
    errors.push({ field: 'nombre', message: 'Nombre debe ser texto' });
  }

  return errors;
};

/**
 * Validacion para login
 */
export const validateLogin = (data) => {
  const errors = [];

  const emailError = validators.email(data.email);
  if (emailError) errors.push({ field: 'email', message: emailError });

  const passwordError = validators.required(data.password, 'Password');
  if (passwordError) errors.push({ field: 'password', message: passwordError });

  return errors;
};