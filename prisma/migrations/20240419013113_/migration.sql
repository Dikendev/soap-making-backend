/*
  Warnings:

  - You are about to drop the `Name` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `name` to the `Oil` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Name";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "translation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "oilId" INTEGER NOT NULL,
    "language" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "translation_oilId_fkey" FOREIGN KEY ("oilId") REFERENCES "Oil" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Oil" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "SAP" TEXT NOT NULL,
    "NAOH" REAL NOT NULL,
    "KOH" REAL NOT NULL,
    "updatedBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Oil" ("KOH", "NAOH", "SAP", "createdAt", "id", "updatedAt", "updatedBy") SELECT "KOH", "NAOH", "SAP", "createdAt", "id", "updatedAt", "updatedBy" FROM "Oil";
DROP TABLE "Oil";
ALTER TABLE "new_Oil" RENAME TO "Oil";
CREATE UNIQUE INDEX "Oil_name_key" ON "Oil"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
