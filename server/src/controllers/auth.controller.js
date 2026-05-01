const { login, register } = require("../services/auth.service");
const loginUser = async (request, response) => {
  try {
    const { email, password } = request.body;

    const token = await login(email, password);

    return response.status(200).send({
      token,
    });
  } catch (error) {
    return response.status(401).json({ error: error.message });
  }
};

const registerUser = async (request, response) => {
  try {
    const { email, name, password } = request.body;
    const user = await register(email, name, password);
    return response.status(201).send({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
};

module.exports = { loginUser, registerUser };
