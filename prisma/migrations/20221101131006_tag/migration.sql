/*
  Warnings:

  - You are about to drop the `_BlogToTag` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `tagId` to the `Blog` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "_BlogToTag_B_index";

-- DropIndex
DROP INDEX "_BlogToTag_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_BlogToTag";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "blogId" TEXT,
    CONSTRAINT "Tag_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Tag" ("id", "name") SELECT "id", "name" FROM "Tag";
DROP TABLE "Tag";
ALTER TABLE "new_Tag" RENAME TO "Tag";
CREATE TABLE "new_Blog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT,
    "content" TEXT,
    "firstPicture" TEXT,
    "views" INTEGER DEFAULT 0,
    "commentabled" BOOLEAN DEFAULT true,
    "published" BOOLEAN,
    "createTime" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updateTime" DATETIME,
    "description" TEXT,
    "typeId" TEXT,
    "userId" TEXT,
    "tagId" TEXT NOT NULL,
    CONSTRAINT "Blog_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "Type" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Blog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Blog" ("commentabled", "content", "createTime", "description", "firstPicture", "id", "published", "title", "typeId", "updateTime", "userId", "views") SELECT "commentabled", "content", "createTime", "description", "firstPicture", "id", "published", "title", "typeId", "updateTime", "userId", "views" FROM "Blog";
DROP TABLE "Blog";
ALTER TABLE "new_Blog" RENAME TO "Blog";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
