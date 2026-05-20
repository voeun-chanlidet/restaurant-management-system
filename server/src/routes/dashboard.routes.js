const { getDashboardSummary } = require("../controllers/dashboard.controller");
const protect = require("../middlewares/auth.middleware");
const restrictTo = require("../middlewares/role.middleware");

const dashboardRouter = require("express").Router();

dashboardRouter.get("/", protect, restrictTo("ADMIN"), getDashboardSummary);

module.exports = { dashboardRouter };
