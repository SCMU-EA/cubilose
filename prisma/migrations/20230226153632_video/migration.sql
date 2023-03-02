-- CreateTable
CREATE TABLE `Video` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `href` VARCHAR(191) NOT NULL,
    `ups` INTEGER NOT NULL,
    `firstPicture` VARCHAR(191) NOT NULL,
    `videoClassId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VideoClass` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Video` ADD CONSTRAINT `Video_videoClassId_fkey` FOREIGN KEY (`videoClassId`) REFERENCES `VideoClass`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
