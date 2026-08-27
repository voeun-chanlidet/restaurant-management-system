const {
  getAllPayments,
  getPaymentBySession,
  createPayment,
  downloadReceipt,
} = require("../controllers/payment.controller");

const protect = require("../middlewares/auth.middleware");
const restrictTo = require("../middlewares/role.middleware");
const paymentRouter = require("express").Router();

paymentRouter.get("/", protect, restrictTo("ADMIN", "STAFF"), getAllPayments);
paymentRouter.get(
  "/session/:sessionId",
  protect,
  restrictTo("ADMIN", "STAFF"),
  getPaymentBySession,
);
paymentRouter.post("/", protect, restrictTo("ADMIN", "STAFF"), createPayment);
paymentRouter.get(
  "/:id/receipt",
  protect,
  restrictTo("ADMIN", "STAFF"),
  downloadReceipt,
);

module.exports = { paymentRouter };
