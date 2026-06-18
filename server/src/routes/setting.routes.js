const {
  getSetting,
  updateSetting,
  getPublicSetting,
} = require("../controllers/setting.controller");

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const protect = require("../middlewares/auth.middleware");
const restricTo = require("../middlewares/role.middleware");

const settingRouter = require("express").Router();

settingRouter.get("/public", getPublicSetting);
settingRouter.get("/", protect, restricTo("ADMIN"), getSetting);
settingRouter.patch(
  "/",
  protect,
  restricTo("ADMIN"),
  upload.single("khqrImage"),
  updateSetting,
);

module.exports = { settingRouter };
