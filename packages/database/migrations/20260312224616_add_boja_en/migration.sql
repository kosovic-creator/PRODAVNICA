-- AlterTable
ALTER TABLE "Proizvod" ADD COLUMN     "boja_en" TEXT[];

-- AlterTable
ALTER TABLE "ProizvodVarijanta" ADD COLUMN     "boja_en" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "StavkaKorpe" ADD COLUMN     "boja_en" TEXT;
