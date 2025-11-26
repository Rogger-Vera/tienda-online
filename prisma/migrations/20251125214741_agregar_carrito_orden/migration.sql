-- CreateTable
CREATE TABLE `carritos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuario_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `carritos_usuario_id_key`(`usuario_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `carrito_items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `carrito_id` INTEGER NOT NULL,
    `producto_id` INTEGER NOT NULL,
    `cantidad` INTEGER NOT NULL DEFAULT 1,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `carrito_items_carrito_id_idx`(`carrito_id`),
    INDEX `carrito_items_producto_id_idx`(`producto_id`),
    UNIQUE INDEX `carrito_items_carrito_id_producto_id_key`(`carrito_id`, `producto_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ordenes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `numero_orden` VARCHAR(191) NOT NULL,
    `usuario_id` INTEGER NOT NULL,
    `estado` VARCHAR(191) NOT NULL DEFAULT 'PENDIENTE',
    `subtotal` DECIMAL(10, 2) NOT NULL,
    `impuestos` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `total` DECIMAL(10, 2) NOT NULL,
    `direccion_envio` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ordenes_numero_orden_key`(`numero_orden`),
    INDEX `ordenes_usuario_id_idx`(`usuario_id`),
    INDEX `ordenes_estado_idx`(`estado`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orden_items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orden_id` INTEGER NOT NULL,
    `producto_id` INTEGER NOT NULL,
    `nombre_producto` VARCHAR(191) NOT NULL,
    `precio_unitario` DECIMAL(10, 2) NOT NULL,
    `cantidad` INTEGER NOT NULL,
    `subtotal` DECIMAL(10, 2) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `orden_items_orden_id_idx`(`orden_id`),
    INDEX `orden_items_producto_id_idx`(`producto_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `carritos` ADD CONSTRAINT `carritos_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `carrito_items` ADD CONSTRAINT `carrito_items_carrito_id_fkey` FOREIGN KEY (`carrito_id`) REFERENCES `carritos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `carrito_items` ADD CONSTRAINT `carrito_items_producto_id_fkey` FOREIGN KEY (`producto_id`) REFERENCES `productos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ordenes` ADD CONSTRAINT `ordenes_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orden_items` ADD CONSTRAINT `orden_items_orden_id_fkey` FOREIGN KEY (`orden_id`) REFERENCES `ordenes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orden_items` ADD CONSTRAINT `orden_items_producto_id_fkey` FOREIGN KEY (`producto_id`) REFERENCES `productos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
