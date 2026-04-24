const express = require("express");
const router = express.Router();

const {
  calculateMacros,
  getFoods,
  filterFoods,
  searchFoods,
} = require("../controllers/foodController");

// routes
router.post("/calculate", calculateMacros);
router.get("/foods", getFoods);
router.get("/foods/filter", filterFoods);
router.get("/foods/search", searchFoods);

module.exports = router;
