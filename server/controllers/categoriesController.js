const prisma = require("../prisma/prisma");
const bcrypt = require("bcrypt");

// ADD NEW OCASSION

exports.addCategory = async (req, res) => {
  console.log(req.body);
  const categoryData = req.body;
  const { category_name, parent_category_id } = categoryData;

  try {
    // Check if the Category already exists based on the name
    const existingCategory = await prisma.categories.findFirst({
      where: { category_name },
    });

    // If the Category already exists, return an error message
    if (existingCategory) {
      return res
        .status(409)
        .json({ error: "This Category has been already added" });
    }

    // If the Category does not exist, create a new category
    const Category = await prisma.categories.create({
      data: categoryData,
    });

    // Send a success response
    res.status(201).json({ message: "Category added to database", Category });
  } catch (error) {
    console.error("Prisma Error:", error);
    res
      .status(500)
      .json({ error: "Failed to create Category", details: error });
  }
};

// GET ALL CATEGORIES
exports.getAllCategories = async (req, res) => {
  console.log(req.body);
  try {
    const categories = await prisma.categories.findMany();

    res.status(200).json({
      status: "success",

      results: categories.length,
      data: {
        categories,
      },
    });
  } catch (error) {
    console.log(error);
  }
};
