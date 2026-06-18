const {
  getAllMenus,
  createMenu,
  updateMenu,
  deleteMenu,
} = require("../controllers/menu.controller");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const protect = require("../middlewares/auth.middleware");
const restrictTo = require("../middlewares/role.middleware");

const menuRouter = require("express").Router();

// Public
menuRouter.get("/", getAllMenus);

// Admin Only
// menuRouter.get("/", protect, getAllMenus);
menuRouter.post(
  "/",
  protect,
  restrictTo("ADMIN"),
  upload.single("image"),
  createMenu,
);
menuRouter.patch(
  "/:id",
  protect,
  restrictTo("ADMIN"),
  upload.single("image"),
  updateMenu,
);
menuRouter.delete("/:id", protect, restrictTo("ADMIN"), deleteMenu);

module.exports = { menuRouter };
