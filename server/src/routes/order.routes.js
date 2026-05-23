const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  getUnpaidServedOrders,
} = require("../controllers/order.controller");

const protect = require("../middlewares/auth.middleware");
const restrictTo = require("../middlewares/role.middleware");

const orderRouter = require("express").Router();

orderRouter.get(
  "/",
  protect,
  restrictTo("ADMIN", "STAFF", "KITCHEN"),
  getAllOrders,
);
orderRouter.get(
  "/unpaid",
  protect,
  restrictTo("ADMIN", "STAFF"),
  getUnpaidServedOrders,
);
orderRouter.get(
  "/:id",
  protect,
  restrictTo("ADMIN", "STAFF", "KITCHEN"),
  getOrderById,
);

orderRouter.post("/", protect, restrictTo("ADMIN", "STAFF"), createOrder);
orderRouter.patch(
  "/:id/status",
  protect,
  restrictTo("ADMIN", "STAFF", "KITCHEN"),
  updateOrderStatus,
);
orderRouter.patch("/:id/cancel", protect, restrictTo("ADMIN"), cancelOrder);

module.exports = { orderRouter };
