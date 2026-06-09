import api from "./api";

const getSettings = async () => {
  const response = await api.get("/settings");
  return response.data.settings;
};

const updateSettings = async (data) => {
  const response = await api.patch("/settings", data);
  return response.data.updatedSetting;
};

export default {
  getSettings,
  updateSettings,
};
