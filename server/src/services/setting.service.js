const Setting = require("../models/setting.model");

const getSetting = async () => {
  const [settings] = await Setting.findOrCreate({
    where: { singleton_guard: 1 },
    defaults: {
      restaurant_name: "My Restaurant",
      currency: "USD",
      exchange_rate: 4100.0,
    },
  });
  return settings;
};

const updateSetting = async (data) => {
  const settings = await getSetting();
  const result = await settings.update(data);
  return result;
};

const getPublicSetting = async () => {
  const settings = await getSetting();
  return {
    currency: settings.currency,
    exchange_rate: settings.exchange_rate,
    khqr_image_url: settings.khqr_image_url,
  };
};

module.exports = { getSetting, updateSetting, getPublicSetting };
