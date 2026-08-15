const { hashPassword } = require("../utils/hash");
const { User } = require("../models/user.model");

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
  const user = await User.findOne({ where: { email } });
  if (user) throw new Error("Email already exist!");

  if (role === "ADMIN") throw new Error("Cannot assign ADMIN role");
  const hashedPassword = await hashPassword(password);
  const newUser = await User.create({
    email,
    name,
    password: hashedPassword,
    role,
  });
  const { password: _, ...userWithoutPassword } = newUser.toJSON();
  return userWithoutPassword;
};

const updateUser = async (id, data, currentUserId) => {
  if (parseInt(id) === parseInt(currentUserId) && data.isActive === false)
    throw new Error("You cannot deactivate your own account.");
  const user = await User.findByPk(id);
  if (!user) throw new Error("User not found!");

  if (data.email && data.email !== user.email) {
    const existingUser = await User.findOne({ where: { email: data.email } });
    if (existingUser) {
      throw new Error("Email already exists!");
    }
  }
  if (data.role === "ADMIN") {
    throw new Error("Cannot assign ADMIN role");
  }

  if (data.password) {
    data.password = await hashPassword(data.password);
  }

  const updatedUser = await user.update(data);
  const { password: _, ...userWithoutPassword } = updatedUser.toJSON();
  return userWithoutPassword;
};

const deleteUser = async (id, currentUserId) => {
  if (parseInt(id) === parseInt(currentUserId)) {
    throw new Error("You cannot deactivate your own account.");
  }
  const user = await User.findByPk(id);
  if (!user) throw new Error("User not found!");

  const deactivatedUser = await user.update({ isActive: false });
  const { password: _, ...userWithoutPassword } = deactivatedUser.toJSON();
  return userWithoutPassword;
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
