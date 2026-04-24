const nutritionDB = {
  // ================== 🌾 GRAINS ==================
  oats_raw: {
    calories: 3.9,
    protein: 0.17,
    carbs: 0.66,
    fat: 0.07,
    fiber: 0.1,
    category: "carb",
    tags: ["high_carb", "moderate_protein", "high_fiber"],
  },

  oats_cooked: {
    calories: 0.7,
    protein: 0.025,
    carbs: 0.12,
    fat: 0.015,
    fiber: 0.017,
    category: "carb",
    tags: ["high_carb", "fiber_source"],
  },

  rice_cooked: {
    calories: 1.3,
    protein: 0.02,
    carbs: 0.28,
    fat: 0.003,
    fiber: 0.004,
    category: "carb",
    tags: ["high_carb", "low_fat"],
  },

  roti: {
    calories: 2.4,
    protein: 0.08,
    carbs: 0.5,
    fat: 0.03,
    fiber: 0.02,
    category: "carb",
    tags: ["high_carb"],
  },

  bread_brown: {
    calories: 2.5,
    protein: 0.09,
    carbs: 0.45,
    fat: 0.03,
    fiber: 0.07,
    category: "carb",
    tags: ["high_carb", "high_fiber"],
  },

  // ================== 🍗 PROTEIN ==================
  chicken_cooked: {
    calories: 1.65,
    protein: 0.31,
    carbs: 0,
    fat: 0.036,
    fiber: 0,
    category: "protein",
    tags: ["high_protein", "low_carb", "lean"],
  },

  egg_boiled: {
    calories: 1.55,
    protein: 0.13,
    carbs: 0.01,
    fat: 0.11,
    fiber: 0,
    category: "protein",
    tags: ["high_protein"],
  },

  egg_white: {
    calories: 0.52,
    protein: 0.11,
    carbs: 0,
    fat: 0,
    fiber: 0,
    category: "protein",
    tags: ["high_protein", "lean", "low_fat"],
  },

  fish_cooked: {
    calories: 1.5,
    protein: 0.26,
    carbs: 0,
    fat: 0.05,
    fiber: 0,
    category: "protein",
    tags: ["high_protein", "lean"],
  },

  whey_protein: {
    calories: 4,
    protein: 0.8,
    carbs: 0.1,
    fat: 0.05,
    fiber: 0.02,
    category: "protein",
    tags: ["high_protein", "fast_digesting"],
  },

  // ================== 🥛 DAIRY ==================
  milk: {
    calories: 0.61,
    protein: 0.032,
    carbs: 0.05,
    fat: 0.033,
    fiber: 0,
    category: "mixed",
    tags: ["protein_source"],
  },

  curd: {
    calories: 0.6,
    protein: 0.035,
    carbs: 0.04,
    fat: 0.03,
    fiber: 0,
    category: "mixed",
    tags: ["protein_source", "gut_health"],
  },

  paneer: {
    calories: 2.65,
    protein: 0.18,
    carbs: 0.02,
    fat: 0.21,
    fiber: 0,
    category: "fat",
    tags: ["high_fat", "moderate_protein"],
  },

  greek_yogurt: {
    calories: 0.59,
    protein: 0.1,
    carbs: 0.036,
    fat: 0.004,
    fiber: 0,
    category: "protein",
    tags: ["high_protein", "low_fat"],
  },

  // ================== 🫘 PULSES ==================
  dal_cooked: {
    calories: 1.16,
    protein: 0.09,
    carbs: 0.2,
    fat: 0.01,
    fiber: 0.08,
    category: "mixed",
    tags: ["moderate_protein", "high_fiber"],
  },

  chickpeas_boiled: {
    calories: 1.64,
    protein: 0.09,
    carbs: 0.27,
    fat: 0.026,
    fiber: 0.076,
    category: "mixed",
    tags: ["high_carb", "high_fiber"],
  },

  rajma_cooked: {
    calories: 1.27,
    protein: 0.09,
    carbs: 0.23,
    fat: 0.005,
    fiber: 0.065,
    category: "mixed",
    tags: ["high_fiber", "moderate_protein"],
  },

  // ================== 🍌 FRUITS ==================
  banana: {
    calories: 0.89,
    protein: 0.011,
    carbs: 0.23,
    fat: 0.003,
    fiber: 0.026,
    category: "carb",
    tags: ["high_carb", "fiber_source"],
  },

  apple: {
    calories: 0.52,
    protein: 0.003,
    carbs: 0.14,
    fat: 0.002,
    fiber: 0.024,
    category: "carb",
    tags: ["fiber_source"],
  },

  orange: {
    calories: 0.47,
    protein: 0.009,
    carbs: 0.12,
    fat: 0.001,
    fiber: 0.024,
    category: "carb",
    tags: ["fiber_source"],
  },

  // ================== 🥦 VEGETABLES ==================
  potato_boiled: {
    calories: 0.87,
    protein: 0.02,
    carbs: 0.2,
    fat: 0.001,
    fiber: 0.018,
    category: "carb",
    tags: ["high_carb"],
  },

  onion: {
    calories: 0.4,
    protein: 0.011,
    carbs: 0.09,
    fat: 0.001,
    fiber: 0.017,
    category: "carb",
    tags: ["fiber_source"],
  },

  tomato: {
    calories: 0.18,
    protein: 0.009,
    carbs: 0.039,
    fat: 0.002,
    fiber: 0.012,
    category: "carb",
    tags: ["low_calorie"],
  },

  carrot: {
    calories: 0.41,
    protein: 0.009,
    carbs: 0.1,
    fat: 0.002,
    fiber: 0.028,
    category: "carb",
    tags: ["high_fiber"],
  },

  cucumber: {
    calories: 0.16,
    protein: 0.007,
    carbs: 0.04,
    fat: 0.001,
    fiber: 0.005,
    category: "carb",
    tags: ["low_calorie"],
  },

  // ================== 🥜 NUTS ==================
  peanuts: {
    calories: 5.7,
    protein: 0.26,
    carbs: 0.16,
    fat: 0.49,
    fiber: 0.085,
    category: "fat",
    tags: ["high_fat", "moderate_protein"],
  },

  almonds: {
    calories: 5.8,
    protein: 0.21,
    carbs: 0.22,
    fat: 0.5,
    fiber: 0.12,
    category: "fat",
    tags: ["high_fat", "high_fiber"],
  },

  peanut_butter: {
    calories: 5.9,
    protein: 0.25,
    carbs: 0.2,
    fat: 0.5,
    fiber: 0.06,
    category: "fat",
    tags: ["high_fat", "moderate_protein"],
  },

  // ================== 🛢️ FATS ==================
  oil: {
    calories: 9,
    protein: 0,
    carbs: 0,
    fat: 1,
    fiber: 0,
    category: "fat",
    tags: ["pure_fat"],
  },

  ghee: {
    calories: 9,
    protein: 0,
    carbs: 0,
    fat: 1,
    fiber: 0,
    category: "fat",
    tags: ["pure_fat"],
  },
};

const getAllFoods = () => nutritionDB;

const getFoodByName = (name) => nutritionDB[name];

module.exports = {
  nutritionDB,
  getAllFoods,
  getFoodByName,
};
