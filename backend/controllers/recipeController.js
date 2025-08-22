// controllers/recipeController.js
const Recipe = require("../models/recipe");

// GET /api/recipes?page=&limit=
exports.getRecipes = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = await Recipe.findPaginated(page, limit);
    res.json(result);
  } catch (e) {
    next(e);
  }
};

// GET /api/recipes/search?title=&cuisine=&rating=>=4.5&total_time=<=120&calories=<=400
exports.searchRecipes = async (req, res, next) => {
  try {
    const { title, cuisine, rating, total_time, calories } = req.query;

    // Optional: validate comparator params to avoid 500s on bad input
    const bad = [];
    const isOk = (s) => /^(>=|<=|=|>|<)\s*\d+(\.\d+)?$/.test(decodeURIComponent(String(s || "")));
    if (rating && !isOk(rating)) bad.push("rating");
    if (total_time && !isOk(total_time)) bad.push("total_time");
    if (calories && !isOk(calories)) bad.push("calories");

    if (bad.length) {
      return res.status(400).json({
        error: `Invalid comparator for: ${bad.join(", ")}. Use >=, <=, =, >, < (URL-encode in the URL, e.g. %3E%3D4.5).`
      });
    }

    const rows = await Recipe.search({ title, cuisine, rating, total_time, calories });
    res.json({ data: rows });
  } catch (e) {
    next(e);
  }
};

// GET /api/recipes/:id
exports.getRecipeById = async (req, res, next) => {
  try {
    const item = await Recipe.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
  } catch (e) {
    next(e);
  }
};
