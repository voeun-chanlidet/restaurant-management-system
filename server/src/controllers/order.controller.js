const OrderServices = require("../services/order.service");
const TableServices = require("../services/table.service");
const { getIO } = require("../../lib/socket");
const getAllOrders = async (request, response) => {
  try {
    const orders = await OrderServices.getAllOrders();
    return response.status(200).json({ orders });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
};

const getOrderById = async (request, response) => {
  try {
    const order = await OrderServices.getOrderById(request.params.id);
    return response.status(200).json({ order });
  } catch (error) {
    const status = error.message === "Order not found!" ? 404 : 500;
    return response.status(status).json({ error: error.message });
  }
};

const createOrder = async (request, response) => {
  try {
    const order = await OrderServices.createOrder(
      request.body,
      request.user.id,
    );
    const io = getIO();
    io.to(["staff", "admin"]).emit("order:new", order);

    const updatedTable = await TableServices.getTableById(order.tableId);
    io.to(["staff", "admin"]).emit("table:update", updatedTable);
    return response.status(201).json({ order });
  } catch (error) {
    const status = error.message.includes("not found") ? 404 : 500;
    return response.status(status).json({ error: error.message });
  }
};

const updateOrderStatus = async (request, response) => {
  try {
    const { status } = request.body;
    const order = await OrderServices.updateOrderStatus(
      request.params.id,
      status,
      request.user.role,
    );

    const io = getIO();
    switch (order.status) {
      case "IN_PROGRESS":
        io.to(["kitchen", "staff", "admin"]).emit("order:inProgress", order);
        io.to(`customer:${order.sessionId}`).emit("order:statusUpdated", {
          orderId: order.id,
          status: order.status,
        });
        break;
      case "READY":
        io.to(["kitchen", "staff", "admin"]).emit("order:ready", order);
        io.to(`customer:${order.sessionId}`).emit("order:statusUpdated", {
          orderId: order.id,
          status: order.status,
        });
        break;
      case "SERVED": {
        io.to(["staff", "admin"]).emit("order:served", order);
        const updatedTable = await TableServices.getTableById(order.tableId);
        io.to(["staff", "admin"]).emit("table:update", updatedTable);
        io.to(`customer:${order.sessionId}`).emit("order:statusUpdated", {
          orderId: order.id,
          status: order.status,
        });
        break;
      }
      case "CANCELLED":
        io.to(["kitchen", "staff", "admin"]).emit("order:cancelled", order);
        io.to(`customer:${order.sessionId}`).emit("order:statusUpdated", {
          orderId: order.id,
          status: order.status,
        });
        break;
    }
    return response.status(200).json({ order });
  } catch (error) {
    const notFound = error.message === "Order not found!";
    const forbidden =
      error.message.includes("cannot") || error.message.includes("only");
    const status = notFound ? 404 : forbidden ? 403 : 500;
    return response.status(status).json({ error: error.message });
  }
};

const cancelOrder = async (request, response) => {
  try {
    const order = await OrderServices.cancelOrder(request.params.id);
    return response.status(200).json({ order });
  } catch (error) {
    const notFound = error.message === "Order not found!";
    const badRequest =
      error.message.includes("Cannot cancel") ||
      error.message.includes("already");
    const status = notFound ? 404 : badRequest ? 400 : 500;
    return response.status(status).json({ error: error.message });
  }
};
const getUnpaidServedOrders = async (request, response) => {
  try {
    const sessions = await OrderServices.getUnpaidServedOrders();
    return response.status(200).json({ sessions });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  getUnpaidServedOrders,
};
