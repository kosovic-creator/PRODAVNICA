/*
  Warnings:

  - You are about to drop the column `kolicina` on the `Proizvod` table. All the data in the column will be lost.
  - You are about to drop the column `velicina` on the `Proizvod` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Proizvod" DROP COLUMN "kolicina",
DROP COLUMN "velicina",
ADD COLUMN     "boja" TEXT[];

-- CreateTable
CREATE TABLE "ProizvodVarijanta" (
    "id" TEXT NOT NULL,
    "proizvodId" TEXT NOT NULL,
    "boja" TEXT NOT NULL,
    "velicina" TEXT NOT NULL,
    "kolicina" INTEGER NOT NULL,
    "kreiran" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "azuriran" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProizvodVarijanta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProizvodVarijanta_proizvodId_idx" ON "ProizvodVarijanta"("proizvodId");

-- CreateIndex
CREATE UNIQUE INDEX "ProizvodVarijanta_proizvodId_boja_velicina_key" ON "ProizvodVarijanta"("proizvodId", "boja", "velicina");

-- AddForeignKey
ALTER TABLE "ProizvodVarijanta" ADD CONSTRAINT "ProizvodVarijanta_proizvodId_fkey" FOREIGN KEY ("proizvodId") REFERENCES "Proizvod"("id") ON DELETE CASCADE ON UPDATE CASCADE;
