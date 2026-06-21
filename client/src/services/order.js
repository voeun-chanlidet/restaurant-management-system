import api from "./api";

const getAllOrders = async () => {
  const response = await api.get("/orders");
  return response.data;
};

const getOrderById = async (id) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

const createOrder = async (data) => {
  const response = await api.post("/orders", data);
  return response.data;
};

const updateOrderStatus = async (id, status) => {
  const response = await api.patch(`/orders/${id}/status`, { status });
  return response.data;
};

const cancelOrder = async (id) => {
  const response = await api.patch(`/orders/${id}/cancel`);
  return response.data;
};
const getUnpaidServedOrders = async () => {
  const response = await api.get("/orders/unpaid");
  return response.data.sessions;
};

export default {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  getUnpaidServedOrders,
};
