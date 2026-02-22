/*
  Warnings:

  - A unique constraint covering the columns `[korisnikId,proizvodId,boja,velicina]` on the table `StavkaKorpe` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "StavkaKorpe_korisnikId_proizvodId_key";

-- AlterTable
ALTER TABLE "StavkaKorpe" ADD COLUMN     "boja" TEXT,
ADD COLUMN     "velicina" TEXT;

-- AlterTable
ALTER TABLE "StavkaPorudzbine" ADD COLUMN     "boja" TEXT,
ADD COLUMN     "velicina" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "StavkaKorpe_korisnikId_proizvodId_boja_velicina_key" ON "StavkaKorpe"("korisnikId", "proizvodId", "boja", "velicina");
