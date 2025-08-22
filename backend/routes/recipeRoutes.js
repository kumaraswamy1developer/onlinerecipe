const express = require("express");
const {
  getRecipes,
  searchRecipes,
  getRecipeById,
} = require("../controllers/recipeController");

const router = express.Router();


router.get("/", getRecipes);


router.get("/search", searchRecipes);


router.get("/:id", getRecipeById);

module.exports = router;
