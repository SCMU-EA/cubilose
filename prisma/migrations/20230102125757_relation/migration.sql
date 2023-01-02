/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `UserRelation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `UserRelation_userId_key` ON `UserRelation`(`userId`);
