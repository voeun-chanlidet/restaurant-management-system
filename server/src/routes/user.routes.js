const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/user.controller");

const protect = require("../middlewares/auth.middleware");
const restrictTo = require("../middlewares/role.middleware");

const userRouter = require("express").Router();

userRouter.get("/", protect, restrictTo("ADMIN"), getAllUsers);
userRouter.get("/:id", protect, restrictTo("ADMIN"), getUserById);
userRouter.post("/", protect, restrictTo("ADMIN"), createUser);
userRouter.patch("/:id", protect, restrictTo("ADMIN"), updateUser);
userRouter.delete("/:id", protect, restrictTo("ADMIN"), deleteUser);

module.exports = { userRouter };
