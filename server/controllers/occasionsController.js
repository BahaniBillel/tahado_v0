const prisma = require("../prisma/prisma");
const bcrypt = require("bcrypt");

// ADD NEW OCASSION

exports.addOcassion = async (req, res) => {
  console.log(req.body);
  const ocassionsData = req.body;
  const { name } = ocassionsData;

  try {
    // Check if the Ocassion already exists based on the name
    const existingOcassion = await prisma.occasion.findFirst({
      where: { name },
    });

    // If the Ocassion already exists, return an error message
    if (existingOcassion) {
      return res
        .status(409)
        .json({ error: "This ocassions has been already added" });
    }

    // If the Ocassion does not exist, create a new craftman
    const Ocassion = await prisma.Occasion.create({
      data: ocassionsData,
    });

    // Send a success response
    res.status(201).json({ message: "Ocassion added to database", Ocassion });
  } catch (error) {
    console.error("Prisma Error:", error);
    res
      .status(500)
      .json({ error: "Failed to create Ocassion", details: error });
  }
};

// GET ALL OCASSIONS
exports.getAllOcassions = async (req, res) => {
  try {
    const occasions = await prisma.Occasion.findMany();

    res.status(200).json({
      status: "success",
      results: occasions.length,
      data: {
        occasions, // The data is under 'data.occasions'
      },
    });
  } catch (error) {
    // It's important to send an error response back if there is an issue
    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching occasions",
      error: error.message,
    });
    console.log(error);
  }
};
