-- CreateTable
CREATE TABLE "recipes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "lye" REAL NOT NULL,
    "liquidAmount" REAL NOT NULL,
    "superFat" REAL NOT NULL,
    "updatedBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
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
    "updatedAt" DATETIME NOT NULL,
    "recipeId" INTEGER,
    CONSTRAINT "Oil_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipes" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Oil" ("KOH", "NAOH", "SAP", "createdAt", "id", "name", "updatedAt", "updatedBy") SELECT "KOH", "NAOH", "SAP", "createdAt", "id", "name", "updatedAt", "updatedBy" FROM "Oil";
DROP TABLE "Oil";
ALTER TABLE "new_Oil" RENAME TO "Oil";
CREATE UNIQUE INDEX "Oil_name_key" ON "Oil"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
