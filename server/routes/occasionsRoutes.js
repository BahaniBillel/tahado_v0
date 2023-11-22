// routes/productRoutes.js

const express = require("express");
const occasionsController = require("../controllers/occasionsController");
const router = express.Router();

router.get("/", occasionsController.getAllOcassions);
router.post("/addOcassion", occasionsController.addOcassion);

module.exports = router;
