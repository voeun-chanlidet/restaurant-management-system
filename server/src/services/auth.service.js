const { comparePassword, hashPassword } = require("../utils/hash");
const { signToken } = require("../utils/jwt");
const User = require("../models/user.model");

const login = async (email, password) => {
  const user = await User.findOne({ where: { email } });

  if (!user) throw new Error("User not found!");

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) throw new Error("Invalide password!");

  return signToken({ id: user.id, role: user.role });
};

const register = async (email, name, password) => {
  const user = await User.findOne({ where: { email } });

  if (user) throw new Error("User already exist!");
  const hashedPassword = await hashPassword(password);

  return await User.create({ email, name, password: hashedPassword });
};

module.exports = { login, register };
