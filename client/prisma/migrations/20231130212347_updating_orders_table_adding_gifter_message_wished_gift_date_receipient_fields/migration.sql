-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "gifter_message" VARCHAR,
ADD COLUMN     "recipient" VARCHAR,
ADD COLUMN     "wished_gift_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
