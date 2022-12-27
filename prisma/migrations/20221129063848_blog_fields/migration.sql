/*
  Warnings:

  - Made the column `title` on table `Blog` required. This step will fail if there are existing NULL values in that column.
  - Made the column `content` on table `Blog` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ups` on table `Blog` required. This step will fail if there are existing NULL values in that column.
  - Made the column `downs` on table `Blog` required. This step will fail if there are existing NULL values in that column.
  - Made the column `views` on table `Blog` required. This step will fail if there are existing NULL values in that column.
  - Made the column `commentabled` on table `Blog` required. This step will fail if there are existing NULL values in that column.
  - Made the column `published` on table `Blog` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createTime` on table `Blog` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `Blog` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `Blog` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ups` on table `Comment` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Blog` DROP FOREIGN KEY `Blog_userId_fkey`;

-- AlterTable
ALTER TABLE `Blog` MODIFY `title` VARCHAR(191) NOT NULL,
    MODIFY `content` VARCHAR(10000) NOT NULL,
    MODIFY `ups` INTEGER NOT NULL DEFAULT 0,
    MODIFY `downs` INTEGER NOT NULL DEFAULT 0,
    MODIFY `views` INTEGER NOT NULL DEFAULT 0,
    MODIFY `commentabled` BOOLEAN NOT NULL DEFAULT true,
    MODIFY `published` BOOLEAN NOT NULL DEFAULT true,
    MODIFY `createTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `description` VARCHAR(191) NOT NULL,
    MODIFY `userId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Comment` MODIFY `ups` INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE `Blog` ADD CONSTRAINT `Blog_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
