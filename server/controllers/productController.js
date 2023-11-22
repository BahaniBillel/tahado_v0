const db = require("../db/index");
const prisma = require("../prisma/prisma");
const axios = require("axios");

// GET ALL PRODUCTS
exports.getAllProducts = async (req, res) => {
  console.log(req.body);
  try {
    const result = await db.query("select * from products ");
    console.log(result.rows);
    res.status(200).json({
      status: "success",
      results: result.rows.length,
      data: {
        products: result.rows,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

// GET A PRODUCT BY ID
exports.getProduct = (req, res) => {
  // Your logic to fetch a single product
  res.send(`Product ${req.params.id}`);
};

// Add new gift to products table

exports.addGift = async (req, res) => {
  const { categoryId, occasionIds, ...giftData } = req.body;

  try {
    // Start a transaction to ensure atomicity
    const result = await prisma.$transaction(async (prisma) => {
      // Create the product
      const createdGift = await prisma.products.create({
        data: giftData,
      });

      // Create the relation in the ProductCategory table if categoryId is provided
      let productCategory;
      if (categoryId) {
        productCategory = await prisma.productCategory.create({
          data: {
            gift_id: createdGift.gift_id,
            category_id: categoryId,
          },
        });
      }

      // Create the relations in the ProductOccasion table if occasionIds are provided
      let productOccasions;
      if (occasionIds && occasionIds.length > 0) {
        productOccasions = await prisma.productOccasion.createMany({
          data: occasionIds.map((occasionId) => ({
            productId: createdGift.gift_id,
            occasionId: occasionId,
          })),
        });
      }

      // Return the created product and the associations
      return { createdGift, productCategory, productOccasions };
    });

    // If the transaction is successful, send the created product as a response
    res.status(201).json({
      message: "Gift Added to product table",
      gift: result.createdGift,
    });
  } catch (error) {
    console.error("Prisma Error:", error);
    res.status(500).json({ error: "Failed to add new gift", details: error });
  }
};
