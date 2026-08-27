const paymentServices = require("../services/payment.service");
const { generateReceiptBuffer } = require("../services/receipt.service");

const getPaymentBySession = async (request, response) => {
  try {
    const data = { sessionId: request.params.sessionId };
    const payment = await paymentServices.getPaymentBySession(data);
    return response.status(200).json({ payment });
  } catch (error) {
    const status = error.message === "Payment not found!" ? 404 : 500;
    return response.status(status).json({ error: error.message });
  }
};

const getAllPayments = async (request, response) => {
  try {
    const payments = await paymentServices.getAllPayments();
    return response.status(200).json({ payments });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
};

const createPayment = async (request, response) => {
  try {
    const data = request.body;
    const userId = request.user.id;
    const payment = await paymentServices.createPayment(data, userId);
    return response.status(201).json({ payment });
  } catch (error) {
    const notFound = error.message.includes("not found");
    const badRequest =
      error.message.includes("Insufficient") ||
      error.message.includes("already paid") ||
      error.message.includes("must be served");
    const status = notFound ? 404 : badRequest ? 400 : 500;
    return response.status(status).json({ error: error.message });
  }
};
const downloadReceipt = async (req, res, next) => {
  try {
    const { id } = req.params;
    const pdfBuffer = await generateReceiptBuffer(id);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="receipt-${id}.pdf"`,
      "Content-Length": pdfBuffer.length,
    });

    res.send(pdfBuffer);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPaymentBySession,
  getAllPayments,
  createPayment,
  downloadReceipt,
};
