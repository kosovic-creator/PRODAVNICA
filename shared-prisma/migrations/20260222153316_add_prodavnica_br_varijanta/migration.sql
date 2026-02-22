/*
  Warnings:

  - A unique constraint covering the columns `[proizvodId,boja,velicina,prodavnica_br]` on the table `ProizvodVarijanta` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ProizvodVarijanta_proizvodId_boja_velicina_key";

-- AlterTable
ALTER TABLE "ProizvodVarijanta" ADD COLUMN     "prodavnica_br" INTEGER NOT NULL DEFAULT 1;

-- CreateIndex
CREATE UNIQUE INDEX "ProizvodVarijanta_proizvodId_boja_velicina_prodavnica_br_key" ON "ProizvodVarijanta"("proizvodId", "boja", "velicina", "prodavnica_br");
