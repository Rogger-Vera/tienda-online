import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { httpLogger } from './config/logger.js';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware.js';

// Importar rutas
import authRoutes from './modules/auth/auth.routes.js';
import usuariosRoutes from './modules/usuarios/usuarios.routes.js';
import rolesRoutes from './modules/roles/roles.routes.js';
import categoriasRoutes from './modules/categorias/categorias.routes.js';
import productosRoutes from './modules/productos/productos.routes.js';
import carritosRoutes from './modules/carritos/carritos.routes.js';
import ordenesRoutes from './modules/ordenes/ordenes.routes.js';


/**
 * Configuracion de Express App
 */
const app = express();

// Seguridad: Headers HTTP seguros
app.use(helmet());

// CORS: Permitir peticiones desde otros dominios
app.use(cors());

// Limitar peticiones
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requests por IP
  message: 'Demasiadas peticiones desde esta IP, intenta de nuevo mas tarde',
});
app.use('/api', limiter);

// Parsear JSON en requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger HTTP
app.use(httpLogger);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Rutas de la API
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/usuarios', usuariosRoutes);
app.use('/api/v1/roles', rolesRoutes);
app.use('/api/v1/categorias', categoriasRoutes);
app.use('/api/v1/productos', productosRoutes);
app.use('/api/v1/carritos', carritosRoutes);
app.use('/api/v1/ordenes', ordenesRoutes);

// Manejo de rutas no encontradas (404)
app.use(notFoundHandler);

// Manejo global de errores
app.use(errorHandler);

export default app;