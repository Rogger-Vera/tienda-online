import bcrypt from 'bcrypt';
import { config } from '../config/env.js';

/**
 * Hashear contraseña con bcrypt
 * @param {string} password - Contraseña en texto plano
 * @returns {Promise<string>} Contraseña hasheada
 */
export const hashPassword = async (password) => {
  return await bcrypt.hash(password, config.bcrypt.rounds);
};

/**
 * Comparar contraseña con hash
 * @param {string} password - Contraseña en texto plano
 * @param {string} hashedPassword - Hash almacenado
 * @returns {Promise<boolean>} True si coinciden
 */
export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};