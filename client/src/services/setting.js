import api from "./api";

const getSettings = async () => {
  const response = await api.get("/settings");
  return response.data.settings;
};

const getPublicSettings = async () => {
  const response = await api.get("/settings/public");
  return response.data.settings;
};

const updateSettings = async (formData) => {
  const response = await api.patch("/settings", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.updatedSetting;
};

export default {
  getSettings,
  getPublicSettings,
  updateSettings,
};
