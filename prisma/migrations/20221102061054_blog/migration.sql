-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Comment" (
    "id" TEXT NOT NULL,
    "blogId" TEXT,
    "content" TEXT,
    "username" TEXT,
    "avatar" TEXT,
    "type" INTEGER,
    "createTime" DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Comment_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Comment" ("avatar", "blogId", "content", "createTime", "id", "type", "username") SELECT "avatar", "blogId", "content", "createTime", "id", "type", "username" FROM "Comment";
DROP TABLE "Comment";
ALTER TABLE "new_Comment" RENAME TO "Comment";
CREATE UNIQUE INDEX "Comment_id_key" ON "Comment"("id");
CREATE TABLE "new_Tag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "blogId" TEXT NOT NULL,
    CONSTRAINT "Tag_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Tag" ("blogId", "id", "name") SELECT "blogId", "id", "name" FROM "Tag";
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
    CONSTRAINT "Blog_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "Type" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Blog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Blog" ("commentabled", "content", "createTime", "description", "firstPicture", "id", "published", "title", "typeId", "updateTime", "userId", "views") SELECT "commentabled", "content", "createTime", "description", "firstPicture", "id", "published", "title", "typeId", "updateTime", "userId", "views" FROM "Blog";
DROP TABLE "Blog";
ALTER TABLE "new_Blog" RENAME TO "Blog";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
