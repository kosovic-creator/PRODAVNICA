-- AlterTable
ALTER TABLE "Proizvod" ADD COLUMN     "brend" TEXT,
ADD COLUMN     "materijal" TEXT,
ADD COLUMN     "materijal_en" TEXT,
ADD COLUMN     "pol" TEXT,
ADD COLUMN     "pol_en" TEXT,
ADD COLUMN     "uzrast" TEXT,
ADD COLUMN     "uzrast_en" TEXT,
ADD COLUMN     "velicina" TEXT,
ALTER COLUMN "kolicina" SET DEFAULT 1;
