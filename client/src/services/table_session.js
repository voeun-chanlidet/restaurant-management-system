import api from "./api";

const openSession = async (data) => {
  const response = await api.post("/sessions", data);
  return response.data;
};

const getActiveSessionByTable = async (data) => {
  const response = await api.get(`/sessions/table/${data}`);
  return response.data;
};

const getSessionOrders = async (id) => {
  const response = await api.get(`/sessions/${id}/orders`);
  return response.data;
};

const closeSession = async (id) => {
  const response = await api.patch(`/sessions/${id}/close`);
  return response.data;
};

export default {
  openSession,
  getActiveSessionByTable,
  getSessionOrders,
  closeSession,
};
