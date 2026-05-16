const OrderServices = require("../services/order.service");

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

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  cancelOrder,
};
