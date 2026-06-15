const { createQROrder } = require("../controllers/qr.controller");

const qrRouter = require("express").Router();

qrRouter.post("/orders", createQROrder);

module.exports = { qrRouter };
