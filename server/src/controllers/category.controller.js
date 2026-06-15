const categoryServices = require("../services/category.service");

const getAllCategories = async (request, response) => {
  try {
    const categories = await categoryServices.getAllCategories();
    return response.status(200).json({ categories });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
};

const createCategory = async (request, response) => {
  try {
    const { name } = request.body;
    const newCategory = await categoryServices.createCategory(name);
    return response.status(201).json({ category: newCategory });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
};

const updateCategory = async (request, response) => {
  try {
    const id = request.params.id;
    const data = request.body;
    const updatedCategory = await categoryServices.updateCategory(id, data);
    return response.status(200).json({ category: updatedCategory });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
};

const deleteCategory = async (request, response) => {
  try {
    const id = request.params.id;
    await categoryServices.deleteCategory(id);
    return response.status(200).json({ status: "success", data: null });
  } catch (error) {
    if (error.message.includes("still has menu")) {
      return response.status(409).json({ message: error.message });
    }
    return response.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
