/*
  Warnings:

  - You are about to drop the column `type` on the `Pokemon` table. All the data in the column will be lost.
  - Added the required column `typeId` to the `Pokemon` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Pokemon" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "pokedexId" INTEGER NOT NULL,
    "typeId" INTEGER NOT NULL,
    "lifePoints" INTEGER NOT NULL,
    "size" REAL,
    "weight" REAL,
    "imageUrl" TEXT,
    CONSTRAINT "Pokemon_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "Type" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Pokemon" ("id", "imageUrl", "lifePoints", "name", "pokedexId", "size", "weight") SELECT "id", "imageUrl", "lifePoints", "name", "pokedexId", "size", "weight" FROM "Pokemon";
DROP TABLE "Pokemon";
ALTER TABLE "new_Pokemon" RENAME TO "Pokemon";
CREATE UNIQUE INDEX "Pokemon_name_key" ON "Pokemon"("name");
CREATE UNIQUE INDEX "Pokemon_pokedexId_key" ON "Pokemon"("pokedexId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
