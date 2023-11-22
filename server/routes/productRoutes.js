// routes/productRoutes.js

const express = require("express");
const productController = require("../controllers/productController");
const router = express.Router();

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProduct);

router.post("/addGift", productController.addGift);

module.exports = router;
