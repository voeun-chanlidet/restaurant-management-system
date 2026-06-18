import api from "./api";

const getAllMenus = async () => {
  const response = await api.get("/menus");
  return response.data;
};

const createMenu = async (formData) => {
  const response = await api.post("/menus", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

const updateMenu = async (id, formData) => {
  const response = await api.patch(`/menus/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
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
