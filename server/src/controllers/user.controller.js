const userService = require("../services/user.service");
const getAllUsers = async (request, response) => {
  try {
    const users = await userService.getAllUsers();
    return response.status(200).json({ users });
  } catch (error) {
    return response.status(401).json({ error: error.message });
  }
};

const getUserById = async (request, response) => {
  try {
    const id = request.params.id;
    const user = await userService.getUserById(id);
    return response.status(200).json({ user });
  } catch (error) {
    return response.status(401).json({ error: error.message });
  }
};

const createUser = async (request, response) => {
  try {
    const { name, email, password, role } = request.body;
    const newUser = await userService.createUser(name, email, password, role);
    const { password: _, ...userWithoutPassword } = newUser.toJSON();
    return response.status(201).json({ user: userWithoutPassword });
  } catch (error) {
    return response.status(401).json({ error: error.message });
  }
};

const updateUser = async (request, response) => {
  try {
    const id = request.params.id;
    const data = request.body;
    const updatedUser = await userService.updateUser(id, data);
    return response.status(200).json({ updatedUser });
  } catch (error) {
    return response.status(401).json({ error: error.message });
  }
};

const deleteUser = async (request, response) => {
  try {
    const id = request.params.id;
    const deactivatedUser = await userService.deleteUser(id);
    return response.status(200).json({ deactivatedUser });
  } catch (error) {
    return response.status(401).json({ error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
