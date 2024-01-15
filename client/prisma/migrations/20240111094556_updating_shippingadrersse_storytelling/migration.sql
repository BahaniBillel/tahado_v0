/*
  Warnings:

  - You are about to drop the column `country` on the `shippingaddresses` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `shippingaddresses` table. All the data in the column will be lost.
  - Added the required column `characters` to the `Storytelling` table without a default value. This is not possible if the table is not empty.
  - Added the required column `plot` to the `Storytelling` table without a default value. This is not possible if the table is not empty.
  - Added the required column `setting` to the `Storytelling` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Storytelling" ADD COLUMN     "characters" TEXT NOT NULL,
ADD COLUMN     "plot" TEXT NOT NULL,
ADD COLUMN     "setting" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "shippingaddresses" DROP COLUMN "country",
DROP COLUMN "state",
ADD COLUMN     "commune" VARCHAR(50),
ADD COLUMN     "extra_info" VARCHAR(500);
