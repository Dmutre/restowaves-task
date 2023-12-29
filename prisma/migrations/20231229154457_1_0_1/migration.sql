/*
  Warnings:

  - A unique constraint covering the columns `[productId,size]` on the table `ProductSizes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `available` to the `ProductSizes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductSizes" ADD COLUMN     "available" BOOLEAN NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ProductSizes_productId_size_key" ON "ProductSizes"("productId", "size");
