const { Menu } = require("../models");

const getAllMenus = async () => {
  const menus = await Menu.findAll();
  return menus;
};

const createMenu = async (name, price, categoryId, imageUrl) => {
  const menu = await Menu.create({ name, price, categoryId, imageUrl });
  return menu;
};

const updateMenu = async (id, data) => {
  const menu = await Menu.findByPk(id);
  if (!menu) throw new Error("Menu not found!");

  const updatedMenu = await menu.update(data);
  return updatedMenu;
};

const deleteMenu = async (id) => {
  const menu = await Menu.findByPk(id);
  if (!menu) throw new Error("Menu not found!");

  await menu.destroy();
  return;
};

module.exports = {
  getAllMenus,
  createMenu,
  updateMenu,
  deleteMenu,
};
