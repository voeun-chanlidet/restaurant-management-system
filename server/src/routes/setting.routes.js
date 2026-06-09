const {
  getSetting,
  updateSetting,
} = require("../controllers/setting.controller");

const protect = require("../middlewares/auth.middleware");
const restricTo = require("../middlewares/role.middleware");

const settingRouter = require("express").Router();

settingRouter.get("/", protect, restricTo("ADMIN"), getSetting);
settingRouter.patch("/", protect, restricTo("ADMIN"), updateSetting);

module.exports = { settingRouter };
