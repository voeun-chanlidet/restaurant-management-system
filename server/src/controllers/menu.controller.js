const menuServices = require("../services/menu.service");
const { uploadImage } = require("../../lib/cloudinary");

const getAllMenus = async (request, response) => {
  try {
    const menus = await menuServices.getAllMenus();
    return response.status(200).json({ menus });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
};

const createMenu = async (request, response) => {
  try {
    const { name, price, categoryId } = request.body;

    let imageUrl = null;
    if (request.file) {
      imageUrl = await uploadImage(request.file.buffer);
    }

    const newMenu = await menuServices.createMenu(
      name,
      price,
      categoryId,
      imageUrl,
    );
    return response.status(201).json({ menu: newMenu });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
};

const updateMenu = async (request, response) => {
  try {
    const id = request.params.id;
    const data = request.body;
    if (request.file) {
      data.imageUrl = await uploadImage(request.file.buffer);
    }
    const updatedMenu = await menuServices.updateMenu(id, data);
    return response.status(200).json({ menu: updatedMenu });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
};

const deleteMenu = async (request, response) => {
  try {
    const id = request.params.id;
    await menuServices.deleteMenu(id);
    return response.status(200).json({ status: "success", data: null });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllMenus,
  createMenu,
  updateMenu,
  deleteMenu,
};
