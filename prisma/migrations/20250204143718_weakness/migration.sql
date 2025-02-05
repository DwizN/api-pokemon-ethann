/*
  Warnings:

  - You are about to drop the `_PokemonCardToType` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "_PokemonCardToType_B_index";

-- DropIndex
DROP INDEX "_PokemonCardToType_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_PokemonCardToType";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "PokemonAttack" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "damage" INTEGER NOT NULL,
    "type_idid" INTEGER,
    CONSTRAINT "PokemonAttack_type_idid_fkey" FOREIGN KEY ("type_idid") REFERENCES "Type" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_PokemonAttackToPokemonCard" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_PokemonAttackToPokemonCard_A_fkey" FOREIGN KEY ("A") REFERENCES "PokemonAttack" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_PokemonAttackToPokemonCard_B_fkey" FOREIGN KEY ("B") REFERENCES "PokemonCard" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_PokemonTypes" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_PokemonTypes_A_fkey" FOREIGN KEY ("A") REFERENCES "PokemonCard" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_PokemonTypes_B_fkey" FOREIGN KEY ("B") REFERENCES "Type" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PokemonCard" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "pokedexId" INTEGER NOT NULL,
    "lifePoints" INTEGER NOT NULL,
    "size" REAL,
    "weight" REAL,
    "imageUrl" TEXT,
    "weaknessid" INTEGER,
    CONSTRAINT "PokemonCard_weaknessid_fkey" FOREIGN KEY ("weaknessid") REFERENCES "Type" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_PokemonCard" ("id", "imageUrl", "lifePoints", "name", "pokedexId", "size", "weight") SELECT "id", "imageUrl", "lifePoints", "name", "pokedexId", "size", "weight" FROM "PokemonCard";
DROP TABLE "PokemonCard";
ALTER TABLE "new_PokemonCard" RENAME TO "PokemonCard";
CREATE UNIQUE INDEX "PokemonCard_name_key" ON "PokemonCard"("name");
CREATE UNIQUE INDEX "PokemonCard_pokedexId_key" ON "PokemonCard"("pokedexId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "PokemonAttack_name_key" ON "PokemonAttack"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_PokemonAttackToPokemonCard_AB_unique" ON "_PokemonAttackToPokemonCard"("A", "B");

-- CreateIndex
CREATE INDEX "_PokemonAttackToPokemonCard_B_index" ON "_PokemonAttackToPokemonCard"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PokemonTypes_AB_unique" ON "_PokemonTypes"("A", "B");

-- CreateIndex
CREATE INDEX "_PokemonTypes_B_index" ON "_PokemonTypes"("B");
