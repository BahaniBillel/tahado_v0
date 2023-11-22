// routes/productRoutes.js

const express = require("express");
const wishlistItemsController = require("../controllers/wishlistItemsController");
const router = express.Router();

router.get("/", wishlistItemsController.getAllWishListItems);

router.post("/wish", wishlistItemsController.postToWishListItems);
router.post("/unwish", wishlistItemsController.removeFromWishListItems);

module.exports = router;
