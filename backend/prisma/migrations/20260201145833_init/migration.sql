-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Movie` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tmdbId` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `overview` TEXT NOT NULL,
    `posterPath` VARCHAR(191) NULL,
    `backdropPath` VARCHAR(191) NULL,
    `releaseDate` VARCHAR(191) NULL,
    `voteAverage` DOUBLE NULL,
    `genres` VARCHAR(191) NULL,
    `isFeatured` BOOLEAN NOT NULL DEFAULT false,
    `videoUrl` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Movie_tmdbId_key`(`tmdbId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WatchHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `movieId` INTEGER NOT NULL,
    `watchedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `WatchHistory_userId_movieId_key`(`userId`, `movieId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `WatchHistory` ADD CONSTRAINT `WatchHistory_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WatchHistory` ADD CONSTRAINT `WatchHistory_movieId_fkey` FOREIGN KEY (`movieId`) REFERENCES `Movie`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
