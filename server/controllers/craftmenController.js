const prisma = require("../prisma/prisma");
const bcrypt = require("bcrypt");

// CREATE NEW CRAFTMAN

exports.createCraftman = async (req, res) => {
  console.log(req.body);
  const craftmanData = req.body;

  try {
    // Check if the craftman already exists based on the name
    const existingCraftman = await prisma.craftmen.findFirst({
      where: { name: craftmanData.name },
    });

    // If the craftman already exists, return an error message
    if (existingCraftman) {
      return res.status(409).json({ error: "Craftman already exists" });
    }

    // If the craftman does not exist, create a new craftman
    const craft_man = await prisma.craftmen.create({
      data: craftmanData,
    });

    // Send a success response
    res
      .status(201)
      .json({ message: "Craftman added to database", craftman: craft_man });
  } catch (error) {
    console.error("Prisma Error:", error);
    res
      .status(500)
      .json({ error: "Failed to create craftman", details: error });
  }
};

// GET ALL CRAFTME?N
exports.getCraftmen = async (req, res) => {
  console.log(req.body);
  try {
    // const result = await db.query("select * from users ");
    const craftmen = await prisma.craftmen.findMany();
    // console.log(result.rows);
    res.status(200).json({
      status: "success",
      results: craftmen.length,
      data: {
        craftmen,
      },
    });
  } catch (error) {
    console.log(error);
  }
};
