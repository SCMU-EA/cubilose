/*
  Warnings:

  - You are about to drop the column `author` on the `Blog` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
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
    CONSTRAINT "Blog_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "Type" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Blog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Blog" ("commentabled", "content", "createTime", "description", "firstPicture", "id", "published", "title", "typeId", "updateTime", "userId", "views") SELECT "commentabled", "content", "createTime", "description", "firstPicture", "id", "published", "title", "typeId", "updateTime", "userId", "views" FROM "Blog";
DROP TABLE "Blog";
ALTER TABLE "new_Blog" RENAME TO "Blog";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
