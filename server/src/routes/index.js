const { authRouter } = require("./auth.routes");
const { userRouter } = require("./user.routes");
const routes = require("express").Router();

routes.use("/auth", authRouter);
routes.use("/users", userRouter);

module.exports = { routes };
