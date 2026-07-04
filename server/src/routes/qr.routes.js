const {
  createQROrder,
  getSessionOrderStatuses,
} = require("../controllers/qr.controller");

const qrRouter = require("express").Router();

qrRouter.post("/orders", createQROrder);
qrRouter.get("/orders/session/:sessionId/status", getSessionOrderStatuses);

module.exports = { qrRouter };
