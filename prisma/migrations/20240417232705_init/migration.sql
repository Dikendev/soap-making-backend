-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_INCIName" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "oilId" INTEGER NOT NULL,
    "language" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "INCIName_oilId_fkey" FOREIGN KEY ("oilId") REFERENCES "Oil" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_INCIName" ("id", "language", "name", "oilId") SELECT "id", "language", "name", "oilId" FROM "INCIName";
DROP TABLE "INCIName";
ALTER TABLE "new_INCIName" RENAME TO "INCIName";
CREATE TABLE "new_Name" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "oilId" INTEGER NOT NULL,
    "language" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "Name_oilId_fkey" FOREIGN KEY ("oilId") REFERENCES "Oil" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Name" ("id", "language", "name", "oilId") SELECT "id", "language", "name", "oilId" FROM "Name";
DROP TABLE "Name";
ALTER TABLE "new_Name" RENAME TO "Name";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
