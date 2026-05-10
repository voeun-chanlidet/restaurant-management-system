import api from "./api";

const getAllMenus = async () => {
  const response = await api.get("/menus");
  return response.data;
};

const createMenu = async (newObject) => {
  const response = await api.post("/menus", newObject);
  return response.data;
};

const updateMenu = async (id, newObject) => {
  const response = await api.patch(`/menus/${id}`, newObject);
  return response.data;
};

const deleteMenu = async (id) => {
  const response = await api.delete(`/menus/${id}`);
  return response.data;
};

export default {
  getAllMenus,
  createMenu,
  updateMenu,
  deleteMenu,
};
