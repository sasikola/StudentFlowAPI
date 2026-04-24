const {
  nutritionDB,
  getAllFoods,
  getFoodByName,
} = require("../models/nutritionModel");

const normalize = (name) => name.toLowerCase().replace(/\s+/g, "_");

const round = (num) => Number(num.toFixed(2));

// ================== CALCULATE ==================
const calculateMacros = (req, res) => {
  const { items } = req.body;

  if (!items || !Array.isArray(items)) {
    return res.status(400).json({ error: "Invalid items array" });
  }

  let total = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
  };

  let breakdown = [];

  for (let item of items) {
    const key = normalize(item.name);
    const food = getFoodByName(key);

    if (!food) {
      return res.status(400).json({ error: `Food not found: ${item.name}` });
    }

    if (item.quantity <= 0) {
      return res.status(400).json({ error: "Quantity must be > 0" });
    }

    const macros = {
      name: key,
      calories: round(food.calories * item.quantity),
      protein: round(food.protein * item.quantity),
      carbs: round(food.carbs * item.quantity),
      fat: round(food.fat * item.quantity),
      fiber: round(food.fiber * item.quantity),
    };

    total.calories += macros.calories;
    total.protein += macros.protein;
    total.carbs += macros.carbs;
    total.fat += macros.fat;
    total.fiber += macros.fiber;

    breakdown.push(macros);
  }

  res.json({
    total: {
      calories: round(total.calories),
      protein: round(total.protein),
      carbs: round(total.carbs),
      fat: round(total.fat),
      fiber: round(total.fiber),
    },
    breakdown,
  });
};

// ================== GET ALL ==================
const getFoods = (req, res) => {
  res.json(getAllFoods());
};

// ================== FILTER ==================
const filterFoods = (req, res) => {
  const { category, tag } = req.query;

  let result = Object.entries(nutritionDB);

  if (category) {
    result = result.filter(([_, v]) => v.category === category);
  }

  if (tag) {
    result = result.filter(([_, v]) => v.tags.includes(tag));
  }

  res.json(Object.fromEntries(result));
};

// ================== SEARCH ==================
const searchFoods = (req, res) => {
  const { q } = req.query;

  if (!q) return res.json({});

  const query = q.toLowerCase();

  const result = Object.entries(nutritionDB).filter(([name]) =>
    name.includes(query),
  );

  res.json(Object.fromEntries(result));
};

module.exports = {
  calculateMacros,
  getFoods,
  filterFoods,
  searchFoods,
};
