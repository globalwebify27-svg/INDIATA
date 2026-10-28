-- CreateTable
CREATE TABLE `organizations` (
    `id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(150) NOT NULL,
    `slug` VARCHAR(100) NOT NULL,
    `status` ENUM('PENDING', 'ACTIVE', 'SUSPENDED', 'EXPIRED') NOT NULL DEFAULT 'ACTIVE',
    `planType` ENUM('TRIAL_5D', 'OFFICE_6M', 'OFFICE_12M', 'ELECTION_MODULE') NOT NULL DEFAULT 'TRIAL_5D',
    `hasAiMode` BOOLEAN NOT NULL DEFAULT false,
    `aiSeatsLimit` INTEGER NOT NULL DEFAULT 0,
    `state` VARCHAR(50) NOT NULL,
    `district` VARCHAR(100) NOT NULL,
    `constituencyName` VARCHAR(150) NOT NULL,
    `electionType` VARCHAR(50) NOT NULL,
    `pollingDate` DATE NULL,
    `distributorId` VARCHAR(36) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `organizations_slug_key`(`slug`),
    INDEX `organizations_status_idx`(`status`),
    INDEX `organizations_distributorId_idx`(`distributorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `distributors` (
    `id` VARCHAR(36) NOT NULL,
    `companyName` VARCHAR(150) NOT NULL,
    `contactName` VARCHAR(100) NOT NULL,
    `email` VARCHAR(120) NOT NULL,
    `phone` VARCHAR(20) NOT NULL,
    `userId` VARCHAR(36) NULL,
    `status` ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
    `commissionRatePct` DECIMAL(5, 2) NOT NULL DEFAULT 10.00,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `distributors_email_key`(`email`),
    UNIQUE INDEX `distributors_phone_key`(`phone`),
    UNIQUE INDEX `distributors_userId_key`(`userId`),
    INDEX `distributors_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(36) NOT NULL,
    `email` VARCHAR(120) NULL,
    `phone` VARCHAR(20) NOT NULL,
    `name` VARCHAR(150) NOT NULL,
    `passwordHash` VARCHAR(255) NULL,
    `role` ENUM('SUPER_ADMIN', 'DISTRIBUTOR', 'CANDIDATE_ADMIN', 'KARYAKARTA') NOT NULL DEFAULT 'KARYAKARTA',
    `status` ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_APPROVAL') NOT NULL DEFAULT 'ACTIVE',
    `organizationId` VARCHAR(36) NULL,
    `hasAiSeat` BOOLEAN NOT NULL DEFAULT false,
    `activationKey` VARCHAR(6) NULL,
    `reactivationKey` VARCHAR(12) NULL,
    `deviceUuid` VARCHAR(128) NULL,
    `lastLoginAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    UNIQUE INDEX `users_phone_key`(`phone`),
    UNIQUE INDEX `users_activationKey_key`(`activationKey`),
    INDEX `users_organizationId_role_idx`(`organizationId`, `role`),
    INDEX `users_phone_idx`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `refresh_tokens` (
    `id` VARCHAR(36) NOT NULL,
    `tokenHash` VARCHAR(64) NOT NULL,
    `userId` VARCHAR(36) NOT NULL,
    `deviceInfo` VARCHAR(255) NULL,
    `ipAddress` VARCHAR(45) NULL,
    `isRevoked` BOOLEAN NOT NULL DEFAULT false,
    `expiresAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `refresh_tokens_tokenHash_key`(`tokenHash`),
    INDEX `refresh_tokens_userId_isRevoked_idx`(`userId`, `isRevoked`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `organizations` ADD CONSTRAINT `organizations_distributorId_fkey` FOREIGN KEY (`distributorId`) REFERENCES `distributors`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `distributors` ADD CONSTRAINT `distributors_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organizations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `refresh_tokens` ADD CONSTRAINT `refresh_tokens_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
