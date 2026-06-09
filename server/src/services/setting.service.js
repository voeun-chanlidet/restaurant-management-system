const Setting = require("../models/setting.model");

const getSetting = async () => {
  const [settings] = await Setting.findOrCreate({
    where: { singleton_guard: 1 },
    defaults: {
      restaurant_name: "My Restaurant",
      currency: "USD",
    },
  });
  return settings;
};

const updateSetting = async (data) => {
  const settings = await getSetting();

  const result = await settings.update(data);
  return result;
};

module.exports = { getSetting, updateSetting };
