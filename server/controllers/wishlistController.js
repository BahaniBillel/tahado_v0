const db = require("../db/index");

const prisma = require("../prisma/prisma");

// GET ALL THE TABLE OF WISHLIST FROM DATABASE
exports.getAllWishList = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM wishlist");

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

// POST WISH TO WISHLIST TABLE IN DATABASE
exports.postToWishList = async (req, res) => {
  const wishlistData = req.body;
  console.log("About to insert the following data:", wishlistData);
  const userId = parseInt(wishlistData.user_id, 10);
  const productId = parseInt(wishlistData.product_id, 10);

  try {
    const wish = await prisma.wishlist.create({
      data: { user_id: userId },
    });
    if (wish.wishlist_id) {
      const wishitem = await prisma.wishlistitems.create({
        data: {
          wishlist_id: wish.wishlist_id,
          product_id: productId,
        },
      });
    }
    res.status(200).json(wish);
  } catch (error) {
    res.status(500).json({ error: "Failed to create a wish" });
  }
};

exports.removeFromWishList = async (req, res) => {
  const wishlistData = req.body;
  console.log("the data about to be removed", wishlistData);

  try {
    await prisma.$transaction([
      prisma.wishlistitems.deleteMany({
        where: {
          wishlist_id: parseInt(wishlistData.wishlist_id, 10),
        },
      }),

      prisma.wishlist.delete({
        where: {
          wishlist_id: parseInt(wishlistData.wishlist_id, 10),
        },
      }),
    ]);

    res.status(200).json({ message: "Wish list items deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting wish list items" });
  }
};
