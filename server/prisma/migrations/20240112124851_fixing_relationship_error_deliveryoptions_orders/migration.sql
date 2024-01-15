-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_order_id_fkey";

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "delivery_option_id" INTEGER;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_delivery_option_id_fkey" FOREIGN KEY ("delivery_option_id") REFERENCES "DeliveryOptions"("delivery_option_id") ON DELETE SET NULL ON UPDATE CASCADE;
