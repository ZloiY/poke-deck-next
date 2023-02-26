/*
  Warnings:

  - Added the required column `deckLength` to the `Deck` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isFull` to the `Deck` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Deck" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "private" BOOLEAN NOT NULL,
    "isEmpty" BOOLEAN NOT NULL,
    "isFull" BOOLEAN NOT NULL,
    "deckLength" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Deck_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Deck" ("id", "isEmpty", "name", "private", "userId") SELECT "id", "isEmpty", "name", "private", "userId" FROM "Deck";
DROP TABLE "Deck";
ALTER TABLE "new_Deck" RENAME TO "Deck";
CREATE UNIQUE INDEX "Deck_userId_key" ON "Deck"("userId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
