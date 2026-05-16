import api from "./api";

const getAllTables = async () => {
  const response = await api.get("/tables");
  return response.data;
};

const createTable = async (data) => {
  const response = await api.post("/tables", data);
  return response.data;
};

const updateTable = async (id, data) => {
  const response = await api.patch(`/tables/${id}`, data);
  return response.data;
};

const deleteTable = async (id) => {
  const response = await api.delete(`/tables/${id}`);
  return response.data;
};

export default {
  getAllTables,
  createTable,
  updateTable,
  deleteTable,
};
