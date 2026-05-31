const {
  getAllPayments,
  getPaymentBySession,
  createPayment,
} = require("../controllers/payment.controller");

const protect = require("../middlewares/auth.middleware");
const restrictTo = require("../middlewares/role.middleware");
const paymentRouter = require("express").Router();

paymentRouter.get("/", protect, restrictTo("ADMIN", "STAFF"), getAllPayments);
paymentRouter.get(
  "/order/:orderId",
  protect,
  restrictTo("ADMIN", "STAFF"),
  getPaymentBySession,
);
paymentRouter.post("/", protect, restrictTo("ADMIN", "STAFF"), createPayment);

module.exports = { paymentRouter };
