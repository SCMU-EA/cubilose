-- DropForeignKey
ALTER TABLE `Comment` DROP FOREIGN KEY `Comment_blogId_fkey`;

-- DropForeignKey
ALTER TABLE `Comment` DROP FOREIGN KEY `Comment_dynamicId_fkey`;

-- DropForeignKey
ALTER TABLE `Comment` DROP FOREIGN KEY `Comment_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Dynamic` DROP FOREIGN KEY `Dynamic_userId_fkey`;

-- AlterTable
ALTER TABLE `Blog` MODIFY `content` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `Comment` MODIFY `content` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `Dynamic` MODIFY `content` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `User` ALTER COLUMN `description` DROP DEFAULT;

-- CreateTable
CREATE TABLE `UserRelation` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `following` TEXT NOT NULL,
    `fans` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_blogId_fkey` FOREIGN KEY (`blogId`) REFERENCES `Blog`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_dynamicId_fkey` FOREIGN KEY (`dynamicId`) REFERENCES `Dynamic`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dynamic` ADD CONSTRAINT `Dynamic_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserRelation` ADD CONSTRAINT `UserRelation_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
