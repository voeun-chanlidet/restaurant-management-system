const {
  getAllTables,
  createTable,
  updateTable,
  deleteTable,
} = require("../controllers/table.controller");

const protect = require("../middlewares/auth.middleware");
const restrictTo = require("../middlewares/role.middleware");

const tableRouter = require("express").Router();

tableRouter.get("/", protect, getAllTables);

tableRouter.post("/", protect, restrictTo("ADMIN"), createTable);
tableRouter.patch("/:id", protect, restrictTo("ADMIN"), updateTable);
tableRouter.delete("/:id", protect, restrictTo("ADMIN"), deleteTable);

module.exports = { tableRouter };
