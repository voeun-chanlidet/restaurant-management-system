import api from "./api";

const getPaymentByOrder = async (id) => {
  const response = await api.get(`/payments/session/${id}`);
  return response.data;
};
const getAllPayments = async () => {
  const response = await api.get("/payments");
  return response.data;
};
const createPayment = async (data) => {
  const response = await api.post(`/payments`, data);
  return response.data;
};

export default {
  getPaymentByOrder,
  getAllPayments,
  createPayment,
};
