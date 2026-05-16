const { hashPassword } = require("../utils/hash");
const User = require("../models/user.model");

const getAllUsers = async () => {
  const users = await User.findAll({ attributes: { exclude: ["password"] } });

  return users;
};

const getUserById = async (id) => {
  const user = await User.findByPk(id, {
    attributes: { exclude: ["password"] },
  });
  if (!user) throw new Error("User not found!");
  return user;
};

const createUser = async (name, email, password, role) => {
  const hashedPassword = await hashPassword(password);
  const user = await User.create({
    email,
    name,
    password: hashedPassword,
    role,
  });
  return user;
};

const updateUser = async (id, data) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error("User not found!");

  if (data.password) {
    data.password = await hashPassword(data.password);
  }

  const updatedUser = await user.update(data);
  return updatedUser;
};

const deleteUser = async (id) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error("User not found!");

  const deactivatedUser = await user.update({ isActive: false });
  return deactivatedUser;
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
