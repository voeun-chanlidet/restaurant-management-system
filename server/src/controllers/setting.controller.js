const { uploadImage } = require("../../lib/cloudinary");
const settingServices = require("../services/setting.service");

const getSetting = async (request, response) => {
  try {
    const settings = await settingServices.getSetting();
    return response.status(200).json({ settings });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
};

const getPublicSetting = async (request, response) => {
  try {
    const settings = await settingServices.getPublicSetting();
    return response.status(200).json({ settings });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
};

const updateSetting = async (request, response) => {
  try {
    const { id, singleton_guard, createdAt, updatedAt, ...safeData } =
      request.body;

    if (request.files) {
      if (request.files["khqrImage"] && request.files["khqrImage"][0]) {
        const khqrFile = request.files["khqrImage"][0];
        safeData.khqr_image_url = await uploadImage(khqrFile.buffer);
      }
      if (request.files["logoImage"] && request.files["logoImage"][0]) {
        const logoFile = request.files["logoImage"][0];
        safeData.logo_url = await uploadImage(logoFile.buffer);
      }
    }

    const updatedSetting = await settingServices.updateSetting(safeData);
    return response.status(200).json({ updatedSetting });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
};

module.exports = { getSetting, getPublicSetting, updateSetting };
