import api from "./api";

const getAllCategories = async () => {
  const response = await api.get("/categories");
  return response.data;
};

const createCategory = async (newObject) => {
  const response = await api.post("/categories", newObject);
  return response.data;
};

const updateCategory = async (id, newObject) => {
  const response = await api.patch(`/categories/${id}`, newObject);
  return response.data;
};

const deleteCategory = async (id) => {
  const response = await api.delete(`/categories/${id}`);
  return response.data;
};

export default {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
