const { Category, Menu } = require("../models");

const getAllCategories = async () => {
  const categories = await Category.findAll();
  return categories;
};

const createCategory = async (name) => {
  const category = await Category.create({ name });
  return category;
};

const updateCategory = async (id, data) => {
  const category = await Category.findByPk(id);
  if (!category) throw new Error("Category not found!");

  const updatedCategory = await category.update(data);
  return updatedCategory;
};

const deleteCategory = async (id) => {
  const category = await Category.findByPk(id);
  if (!category) throw new Error("Category not found!");

  const menu = await Menu.findOne({ where: { categoryId: id } });
  if (menu)
    throw new Error("Cannot Delete Category that still has menu in it!");
  await category.destroy();
  return;
};

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
