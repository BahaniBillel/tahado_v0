-- CreateTable
CREATE TABLE "DeliveryOptions" (
    "delivery_option_id" SERIAL NOT NULL,
    "provider_name" VARCHAR(100) NOT NULL,
    "city" VARCHAR(50) NOT NULL,
    "delivery_time_id" INTEGER,
    "order_id" INTEGER,

    CONSTRAINT "DeliveryOptions_pkey" PRIMARY KEY ("delivery_option_id")
);

-- CreateTable
CREATE TABLE "DeliveryPricing" (
    "pricing_id" SERIAL NOT NULL,
    "delivery_option_id" INTEGER NOT NULL,
    "base_price" DECIMAL(10,2) NOT NULL,
    "additional_cost" DECIMAL(10,2) NOT NULL,
    "total_price" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "DeliveryPricing_pkey" PRIMARY KEY ("pricing_id")
);

-- CreateTable
CREATE TABLE "DeliveryTime" (
    "delivery_time_id" SERIAL NOT NULL,
    "delivery_option_id" INTEGER NOT NULL,
    "estimated_time" INTEGER NOT NULL,

    CONSTRAINT "DeliveryTime_pkey" PRIMARY KEY ("delivery_time_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DeliveryOptions_order_id_key" ON "DeliveryOptions"("order_id");

-- CreateIndex
CREATE INDEX "idx_delivery_options_city" ON "DeliveryOptions"("city");

-- CreateIndex
CREATE INDEX "idx_delivery_pricing_delivery_option" ON "DeliveryPricing"("delivery_option_id");

-- CreateIndex
CREATE INDEX "idx_delivery_time_delivery_option" ON "DeliveryTime"("delivery_option_id");

-- AddForeignKey
ALTER TABLE "DeliveryOptions" ADD CONSTRAINT "DeliveryOptions_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("order_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "DeliveryPricing" ADD CONSTRAINT "DeliveryPricing_delivery_option_id_fkey" FOREIGN KEY ("delivery_option_id") REFERENCES "DeliveryOptions"("delivery_option_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryTime" ADD CONSTRAINT "DeliveryTime_delivery_option_id_fkey" FOREIGN KEY ("delivery_option_id") REFERENCES "DeliveryOptions"("delivery_option_id") ON DELETE RESTRICT ON UPDATE CASCADE;
