/*
  Warnings:

  - You are about to drop the column `Main_Image` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "Main_Image",
ADD COLUMN     "main_image" VARCHAR;
