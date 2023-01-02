/*
  Warnings:

  - You are about to drop the column `following` on the `UserRelation` table. All the data in the column will be lost.
  - Added the required column `followings` to the `UserRelation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `UserRelation` DROP COLUMN `following`,
    ADD COLUMN `followings` TEXT NOT NULL;
