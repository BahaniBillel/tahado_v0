// routes/productRoutes.js

const express = require("express");
const categoriesctroller = require("../controllers/categoriesController");
const router = express.Router();

router.get("/", categoriesctroller.getAllCategories);
router.post("/addCategory", categoriesctroller.addCategory);

module.exports = router;
