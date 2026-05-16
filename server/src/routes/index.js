const { authRouter } = require("./auth.routes");
const { userRouter } = require("./user.routes");
const { categoryRouter } = require("./category.routes");
const { menuRouter } = require("./menu.routes");
const { tableRouter } = require("./table.routes");
const { orderRouter } = require("./order.routes");
const routes = require("express").Router();

routes.use("/auth", authRouter);
routes.use("/users", userRouter);
routes.use("/categories", categoryRouter);
routes.use("/menus", menuRouter);
routes.use("/tables", tableRouter);
routes.use("/orders", orderRouter);

module.exports = { routes };
