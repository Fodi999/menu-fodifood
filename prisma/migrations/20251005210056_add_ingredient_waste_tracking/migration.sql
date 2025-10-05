-- AlterTable
ALTER TABLE "StockItem" ADD COLUMN     "bruttoWeight" DOUBLE PRECISION,
ADD COLUMN     "expiryDays" INTEGER,
ADD COLUMN     "nettoWeight" DOUBLE PRECISION,
ADD COLUMN     "wastePercentage" DOUBLE PRECISION;
