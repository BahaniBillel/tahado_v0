// routes/productRoutes.js

const express = require("express");
const craftmenController = require("../controllers/craftmenController");
const router = express.Router();

router.get("/", craftmenController.getCraftmen);
router.post("/createCraftman", craftmenController.createCraftman);

module.exports = router;
