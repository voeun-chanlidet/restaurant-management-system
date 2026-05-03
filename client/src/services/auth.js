import api from "./api";

const register = async (credentials) => {
  const response = await api.post("/auth/register", credentials);
  return response.data;
};

const login = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

export default { register, login };
