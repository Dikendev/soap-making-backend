/*
  Warnings:

  - You are about to drop the column `superFat` on the `recipes` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_recipes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "lye" REAL NOT NULL,
    "liquidAmount" REAL NOT NULL,
    "updatedBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_recipes" ("createdAt", "id", "liquidAmount", "lye", "name", "updatedAt", "updatedBy") SELECT "createdAt", "id", "liquidAmount", "lye", "name", "updatedAt", "updatedBy" FROM "recipes";
DROP TABLE "recipes";
ALTER TABLE "new_recipes" RENAME TO "recipes";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
