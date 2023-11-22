// routes/productRoutes.js

const express = require("express");
const wishlistController = require("../controllers/wishlistController");
const router = express.Router();

router.get("/", wishlistController.getAllWishList);

router.post("/wish", wishlistController.postToWishList);
router.post("/unwish", wishlistController.removeFromWishList);

module.exports = router;
