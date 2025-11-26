# Tienda online - Backend API

API REST completa para una tienda online desarrollado con Node.js, Express, Prisma y MySQL.

## 🚀 Tecnologías

- **Node.js** v16+ - Runtime de JavaScript
- **Express** v5 - Framework web minimalista
- **Prisma** v6.16.1 - ORM moderno para base de datos
- **MySQL** v8+ - Base de datos relacional
- **JWT** - Autenticación basada en tokens
- **Bcrypt** - Hash seguro de contraseñas
- **Winston** - Sistema de logging profesional
- **Helmet** - Seguridad HTTP
- **Express Rate Limit** - Protección contra abuso

---

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** >= 16.x
- **MySQL** >= 8.x
- **npm** o **yarn**

---

## 🔧 Instalación

### 1. Clonar el repositorio
```bash
git clone 
cd tienda
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto copiando `.env.example`:
```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales:
```env
# Database
DATABASE_URL="mysql://usuario:password@localhost:3306/tienda"

# Server
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=tu_secreto_super_seguro_cambiar_en_produccion
JWT_EXPIRES_IN=24h

# Bcrypt
BCRYPT_ROUNDS=10
```

### 4. Crear base de datos

Conecta a MySQL y crea la base de datos:
```sql
CREATE DATABASE tienda CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 5. Generar Prisma Client
```bash
npm run prisma:generate
```

### 6. Ejecutar migraciones
```bash
npm run prisma:migrate
```

Cuando te pida el nombre de la migración, puedes usar: `init`

### 7. Poblar la base de datos (Seed)
```bash
npm run prisma:seed
```

Esto creará:
- 2 Roles (ADMIN, USUARIO)
- 2 Usuarios de prueba
- 5 Categorías
- 10 Productos de ejemplo

### 8. Iniciar el servidor

**Modo desarrollo (con auto-reload):**
```bash
npm run dev
```

El servidor estará disponible en: `http://localhost:3000`

---