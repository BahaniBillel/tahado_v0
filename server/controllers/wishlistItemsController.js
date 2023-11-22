const db = require("../db/index");

const prisma = require("../prisma/prisma");

// GET ALL THE TABLE OF WISHLISTITEMS FROM DATABASE
exports.getAllWishListItems = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM wishlistitems");

    res.status(200).json({
      status: "success",
      results: result.rows.length,
      data: {
        wishlist: result.rows,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

// POST WISH TO WISHLISTITEMS TABLE IN DATABASE
exports.postToWishListItems = async (req, res) => {
  const wishlistItemsData = req.body;
  console.log("About to insert the following data:", wishlistItemsData);
  wishlistItemsData.wishlist_id = parseInt(wishlistItemsData.wishlist_id, 10);
  wishlistItemsData.product_id = parseInt(wishlistItemsData.product_id, 10);

  try {
    const wishItem = await prisma.wishlistitems.create({
      data: wishlistItemsData,
    });
    res.status(200).json(wish);
  } catch (error) {
    res.status(500).json({ error: "Failed to create a wish item" });
  }
};

// Remove wish from wishlist table in the database
exports.removeFromWishListItems = async (req, res) => {
  const wishlistItemsData = req.body;
  try {
    const wishItem = await prisma.wishlistitems.delete({
      where: {
        // Assuming you have a unique constraint on wishlist_id and user_id
        wishlist_id_product_id: {
          wishlist_id: parseInt(wishlistItemsData.wishlist_id, 10),
          product_id: parseInt(wishlistItemsData.product_id, 10),
        },
      },
    });
    res.status(200).json({ message: "Successfully removed wish item" });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove a wish item" });
  }
};
