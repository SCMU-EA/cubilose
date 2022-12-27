-- DropForeignKey
ALTER TABLE `Comment` DROP FOREIGN KEY `Comment_blogId_fkey`;

-- AlterTable
ALTER TABLE `Comment` ADD COLUMN `dynamicId` VARCHAR(191) NULL,
    MODIFY `blogId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Dynamic` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `content` VARCHAR(1000) NOT NULL,
    `ups` INTEGER NOT NULL,
    `createTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_blogId_fkey` FOREIGN KEY (`blogId`) REFERENCES `Blog`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_dynamicId_fkey` FOREIGN KEY (`dynamicId`) REFERENCES `Dynamic`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dynamic` ADD CONSTRAINT `Dynamic_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
