-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DisasterReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "city" TEXT,
    "district" TEXT,
    "lat" REAL,
    "lng" REAL,
    "name" TEXT,
    "phone" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_DisasterReport" ("city", "createdAt", "description", "district", "id", "lat", "lng", "name", "phone", "status", "type", "updatedAt") SELECT "city", "createdAt", "description", "district", "id", "lat", "lng", "name", "phone", "status", "type", "updatedAt" FROM "DisasterReport";
DROP TABLE "DisasterReport";
ALTER TABLE "new_DisasterReport" RENAME TO "DisasterReport";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
