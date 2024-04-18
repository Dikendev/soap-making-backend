/*
  Warnings:

  - Added the required column `updatedAt` to the `Oil` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Oil" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "SAP" INTEGER NOT NULL,
    "NAOH" REAL NOT NULL,
    "KOH" REAL NOT NULL,
    "updatedBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Oil" ("KOH", "NAOH", "SAP", "id") SELECT "KOH", "NAOH", "SAP", "id" FROM "Oil";
DROP TABLE "Oil";
ALTER TABLE "new_Oil" RENAME TO "Oil";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
