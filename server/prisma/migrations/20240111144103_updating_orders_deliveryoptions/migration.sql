/*
  Warnings:

  - You are about to drop the column `order_id` on the `DeliveryOptions` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "DeliveryOptions" DROP CONSTRAINT "DeliveryOptions_order_id_fkey";

-- DropIndex
DROP INDEX "DeliveryOptions_order_id_key";

-- AlterTable
ALTER TABLE "DeliveryOptions" DROP COLUMN "order_id";

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "DeliveryOptions"("delivery_option_id") ON DELETE RESTRICT ON UPDATE CASCADE;
