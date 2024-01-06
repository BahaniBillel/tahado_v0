-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "flower_pocket" BOOLEAN,
ADD COLUMN     "sender" VARCHAR;

-- CreateTable
CREATE TABLE "Storytelling" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Storytelling_pkey" PRIMARY KEY ("id")
);
