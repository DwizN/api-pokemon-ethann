/*
  Warnings:

  - You are about to drop the column `damage` on the `PokemonAttack` table. All the data in the column will be lost.
  - Added the required column `damages` to the `PokemonAttack` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Deck" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "ownerid" INTEGER NOT NULL,
    CONSTRAINT "Deck_ownerid_fkey" FOREIGN KEY ("ownerid") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_DeckToPokemonCard" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_DeckToPokemonCard_A_fkey" FOREIGN KEY ("A") REFERENCES "Deck" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_DeckToPokemonCard_B_fkey" FOREIGN KEY ("B") REFERENCES "PokemonCard" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PokemonAttack" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "damages" INTEGER NOT NULL,
    "type_idid" INTEGER,
    CONSTRAINT "PokemonAttack_type_idid_fkey" FOREIGN KEY ("type_idid") REFERENCES "Type" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_PokemonAttack" ("id", "name", "type_idid") SELECT "id", "name", "type_idid" FROM "PokemonAttack";
DROP TABLE "PokemonAttack";
ALTER TABLE "new_PokemonAttack" RENAME TO "PokemonAttack";
CREATE UNIQUE INDEX "PokemonAttack_name_key" ON "PokemonAttack"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_DeckToPokemonCard_AB_unique" ON "_DeckToPokemonCard"("A", "B");

-- CreateIndex
CREATE INDEX "_DeckToPokemonCard_B_index" ON "_DeckToPokemonCard"("B");
