import { PrismaClient } from "../src/generated/prisma/client.ts";
import { hashPassword } from "../src/utils/bcrypt.util.js";

const prisma = new PrismaClient();

/**
 * Seed de base de datos
 * Crea datos iniciales necesarios para la aplicacion
 */
async function main() {
  console.log("Iniciando seed...");

  // Crear roles
  const adminRole = await prisma.role.upsert({
    where: { nombre: "ADMIN" },
    update: {},
    create: {
      nombre: "ADMIN",
    },
  });

  const usuarioRole = await prisma.role.upsert({
    where: { nombre: "USUARIO" },
    update: {},
    create: {
      nombre: "USUARIO",
    },
  });

  console.log("Roles creados");

  // Crear usuario admin por defecto
  const adminPassword = await hashPassword("admin123");

  const admin = await prisma.user.upsert({
    where: { email: "admin@ecommerce.com" },
    update: {},
    create: {
      email: "admin@ecommerce.com",
      password: adminPassword,
      nombre: "Administrador",
      roleId: adminRole.id,
      isActive: true,
    },
  });

  console.log("Usuario admin creado");
  console.log("Email: admin@ecommerce.com");
  console.log("Password: admin123");

  // Crear usuario de prueba
  const userPassword = await hashPassword("user123");

  const user = await prisma.user.upsert({
    where: { email: "user@ecommerce.com" },
    update: {},
    create: {
      email: "user@ecommerce.com",
      password: userPassword,
      nombre: "Usuario de Prueba",
      roleId: usuarioRole.id,
      isActive: true,
    },
  });

  console.log("Usuario de prueba creado");
  console.log("Email: user@ecommerce.com");
  console.log("Password: user123");

  // ==================== CATEGORiAS ====================
  console.log("\n📦 Creando categorias...");

  const categoriaElectronica = await prisma.categoria.upsert({
    where: { nombre: "Electronica" },
    update: {},
    create: {
      nombre: "Electronica",
      descripcion: "Productos electronicos y tecnologia",
      isActive: true,
    },
  });

  const categoriaRopa = await prisma.categoria.upsert({
    where: { nombre: "Ropa" },
    update: {},
    create: {
      nombre: "Ropa",
      descripcion: "Ropa y accesorios",
      isActive: true,
    },
  });

  const categoriaHogar = await prisma.categoria.upsert({
    where: { nombre: "Hogar" },
    update: {},
    create: {
      nombre: "Hogar",
      descripcion: "Articulos para el hogar",
      isActive: true,
    },
  });

  const categoriaDeportes = await prisma.categoria.upsert({
    where: { nombre: "Deportes" },
    update: {},
    create: {
      nombre: "Deportes",
      descripcion: "Articulos deportivos y fitness",
      isActive: true,
    },
  });

  const categoriaLibros = await prisma.categoria.upsert({
    where: { nombre: "Libros" },
    update: {},
    create: {
      nombre: "Libros",
      descripcion: "Libros y material de lectura",
      isActive: true,
    },
  });

  console.log("5 categorias creadas");

  // ==================== PRODUCTOS ====================
  console.log("\n🛍️  Creando productos...");

  // Productos de Electronica
  await prisma.producto.upsert({
    where: { id: 1 },
    update: {},
    create: {
      nombre: "Laptop HP Pavilion 15",
      descripcion:
        "Laptop HP Pavilion 15 pulgadas, Intel Core i5, 8GB RAM, 512GB SSD",
      precio: 799.99,
      stock: 15,
      imagenUrl: "https://example.com/laptop-hp.jpg",
      categoriaId: categoriaElectronica.id,
      isActive: true,
    },
  });

  await prisma.producto.upsert({
    where: { id: 2 },
    update: {},
    create: {
      nombre: "Auriculares Sony WH-1000XM4",
      descripcion: "Auriculares inalambricos con cancelacion de ruido",
      precio: 349.99,
      stock: 30,
      imagenUrl: "https://example.com/auriculares-sony.jpg",
      categoriaId: categoriaElectronica.id,
      isActive: true,
    },
  });

  await prisma.producto.upsert({
    where: { id: 3 },
    update: {},
    create: {
      nombre: "Mouse Logitech MX Master 3",
      descripcion: "Mouse ergonomico inalambrico para productividad",
      precio: 99.99,
      stock: 50,
      imagenUrl: "https://example.com/mouse-logitech.jpg",
      categoriaId: categoriaElectronica.id,
      isActive: true,
    },
  });

  // Productos de Ropa
  await prisma.producto.upsert({
    where: { id: 4 },
    update: {},
    create: {
      nombre: "Camiseta Nike Dri-FIT",
      descripcion: "Camiseta deportiva de secado rapido",
      precio: 29.99,
      stock: 100,
      imagenUrl: "https://example.com/camiseta-nike.jpg",
      categoriaId: categoriaRopa.id,
      isActive: true,
    },
  });

  await prisma.producto.upsert({
    where: { id: 5 },
    update: {},
    create: {
      nombre: "Jeans Levis 501",
      descripcion: "Jeans clasicos de corte recto",
      precio: 89.99,
      stock: 60,
      imagenUrl: "https://example.com/jeans-levis.jpg",
      categoriaId: categoriaRopa.id,
      isActive: true,
    },
  });

  // Productos de Hogar
  await prisma.producto.upsert({
    where: { id: 6 },
    update: {},
    create: {
      nombre: "Cafetera Nespresso Vertuo",
      descripcion: "Cafetera de capsulas con tecnologia Vertuo",
      precio: 179.99,
      stock: 25,
      imagenUrl: "https://example.com/cafetera-nespresso.jpg",
      categoriaId: categoriaHogar.id,
      isActive: true,
    },
  });

  await prisma.producto.upsert({
    where: { id: 7 },
    update: {},
    create: {
      nombre: "Aspiradora Dyson V11",
      descripcion: "Aspiradora inalambrica de alta potencia",
      precio: 599.99,
      stock: 10,
      imagenUrl: "https://example.com/aspiradora-dyson.jpg",
      categoriaId: categoriaHogar.id,
      isActive: true,
    },
  });

  // Productos de Deportes
  await prisma.producto.upsert({
    where: { id: 8 },
    update: {},
    create: {
      nombre: "Mancuernas Adjustables 20kg",
      descripcion: "Set de mancuernas ajustables de 5 a 20kg",
      precio: 149.99,
      stock: 20,
      imagenUrl: "https://example.com/mancuernas.jpg",
      categoriaId: categoriaDeportes.id,
      isActive: true,
    },
  });

  await prisma.producto.upsert({
    where: { id: 9 },
    update: {},
    create: {
      nombre: "Yoga Mat Premium",
      descripcion: "Colchoneta de yoga antideslizante 6mm",
      precio: 39.99,
      stock: 75,
      imagenUrl: "https://example.com/yoga-mat.jpg",
      categoriaId: categoriaDeportes.id,
      isActive: true,
    },
  });

  // Productos de Libros
  await prisma.producto.upsert({
    where: { id: 10 },
    update: {},
    create: {
      nombre: "Clean Code - Robert C. Martin",
      descripcion: "Libro sobre buenas practicas de programacion",
      precio: 45.99,
      stock: 40,
      imagenUrl: "https://example.com/clean-code.jpg",
      categoriaId: categoriaLibros.id,
      isActive: true,
    },
  });
  
  console.log("✅ 10 productos creados");

  console.log("Seed completado exitosamente!");
}

main()
  .catch((e) => {
    console.error("Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
