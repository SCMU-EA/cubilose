-- DropForeignKey
ALTER TABLE `Blog` DROP FOREIGN KEY `Blog_typeId_fkey`;

-- AlterTable
ALTER TABLE `Blog` MODIFY `downs` INTEGER NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE `Blog` ADD CONSTRAINT `Blog_typeId_fkey` FOREIGN KEY (`typeId`) REFERENCES `Type`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
