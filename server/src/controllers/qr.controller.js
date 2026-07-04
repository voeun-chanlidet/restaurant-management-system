const { getIO } = require("../../lib/socket");
const QrServices = require("../services/qr.service");
const TableServices = require("../services/table.service");

const createQROrder = async (request, response) => {
  try {
    const order = await QrServices.createQROrder(request.body);
    const io = getIO();
    io.to(["staff", "admin"]).emit("order:new", order);

    const updatedTable = await TableServices.getTableById(order.tableId);
    io.to(["staff", "admin"]).emit("table:update", updatedTable);
    return response.status(201).json(order);
  } catch (error) {
    const status = error.message.includes("not found") ? 404 : 500;
    return response.status(status).json({ error: error.message });
  }
};

const getSessionOrderStatuses = async (request, response) => {
  try {
    const orders = await QrServices.getSessionOrderStatuses(
      request.params.sessionId,
    );
    return response.status(200).json({ orders });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
};
module.exports = { createQROrder, getSessionOrderStatuses };
