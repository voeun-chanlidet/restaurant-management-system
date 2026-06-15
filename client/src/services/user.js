import api from "./api";

const getUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

const createUser = async (data) => {
  const response = await api.post("/users", data);
  return response.data;
};

const updateUser = async (id, data) => {
  const response = await api.patch(`/users/${id}`, data);
  return response.data;
};

const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

export default { getUsers, createUser, updateUser, deleteUser };
