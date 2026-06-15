const {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/category.controller");

const protect = require("../middlewares/auth.middleware");
const restrictTo = require("../middlewares/role.middleware");

const categoryRouter = require("express").Router();

// Public
categoryRouter.get("/", getAllCategories);

// ADMIN Only
// categoryRouter.get("/", protect, getAllCategories);
categoryRouter.post("/", protect, restrictTo("ADMIN"), createCategory);
categoryRouter.patch("/:id", protect, restrictTo("ADMIN"), updateCategory);
categoryRouter.delete("/:id", protect, restrictTo("ADMIN"), deleteCategory);

module.exports = { categoryRouter };
