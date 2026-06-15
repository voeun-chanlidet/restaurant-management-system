const {
  openSession,
  getActiveSessionByTable,
  getSessionOrders,
  closeSession,
} = require("../controllers/session.controller");

const protect = require("../middlewares/auth.middleware");
const restrictTo = require("../middlewares/role.middleware");
const sessionRouter = require("express").Router();

sessionRouter.post("/", protect, restrictTo("STAFF", "ADMIN"), openSession);

// Public
sessionRouter.get("/table/:tableId", getActiveSessionByTable);

// Admin
// sessionRouter.get(
//   "/table/:tableId",
//   protect,
//   restrictTo("STAFF", "ADMIN"),
//   getActiveSessionByTable,
// );
sessionRouter.get(
  "/:sessionId/orders",
  protect,
  restrictTo("ADMIN", "STAFF"),
  getSessionOrders,
);

sessionRouter.patch(
  "/:sessionId/close",
  protect,
  restrictTo("ADMIN", "STAFF"),
  closeSession,
);

module.exports = { sessionRouter };
