import prisma from '../../config/database.js';
import { hashPassword, comparePassword } from '../../utils/bcrypt.util.js';
import { generateToken } from '../../utils/jwt.util.js';
import AppError from '../../utils/AppError.js';
import logger from '../../config/logger.js';

/**
 * Servicio de autenticacion
 * Contiene la logica de negocio para registro y login
 */
class AuthService {
  /**
   * Registrar nuevo usuario
   * @param {object} userData - Datos del usuario (email, password, nombre)
   * @returns {Promise<object>} Usuario creado y token
   */
  async register(userData) {
    const { email, password, nombre } = userData;

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError('El email ya esta registrado', 409);
    }

    // Hashear password
    const hashedPassword = await hashPassword(password);

    // Obtener rol USUARIO (por defecto)
    const usuarioRole = await prisma.role.findUnique({
      where: { nombre: 'USUARIO' },
    });

    if (!usuarioRole) {
      throw new AppError('Rol USUARIO no encontrado. Ejecutar seed', 500);
    }

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        nombre: nombre || null,
        roleId: usuarioRole.id,
      },
      include: {
        role: true,
      },
    });

    logger.info(`Nuevo usuario registrado: ${email}`);

    // Generar token
    const token = generateToken({
      id: user.id,
      email: user.email,
      roleId: user.roleId,
    });

    // No devolver password
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  }

  /**
   * Login de usuario
   * @param {object} credentials - Email y password
   * @returns {Promise<object>} Usuario y token
   */
  async login(credentials) {
    const { email, password } = credentials;

    // Buscar usuario por email
    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user) {
      throw new AppError('Credenciales invalidas', 401);
    }

    // Verificar si el usuario esta activo
    if (!user.isActive) {
      throw new AppError('Usuario inactivo', 403);
    }

    // Comparar password
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new AppError('Credenciales invalidas', 401);
    }

    logger.info(`Usuario logueado: ${email}`);

    // Generar token
    const token = generateToken({
      id: user.id,
      email: user.email,
      roleId: user.roleId,
    });

    // No devolver password
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  }

  /**
   * Obtener perfil del usuario autenticado
   * @param {number} userId - ID del usuario
   * @returns {Promise<object>} Datos del usuario
   */
  async getProfile(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      // include: { role: true },
      select: {
        id: true,
        email: true,
        nombre: true,
        isActive: true,
        role: {
          select: {
            id: true,
            nombre: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new AppError('Usuario no encontrado', 404);
    }

    return user;
  }
}

export default new AuthService();