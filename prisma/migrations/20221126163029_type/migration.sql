-- DropForeignKey
ALTER TABLE `Blog` DROP FOREIGN KEY `Blog_typeId_fkey`;

-- AddForeignKey
ALTER TABLE `Blog` ADD CONSTRAINT `Blog_typeId_fkey` FOREIGN KEY (`typeId`) REFERENCES `Type`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
