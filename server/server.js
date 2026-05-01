require("dotenv").config();
const app = require("./app");
const { env } = require("./src/config/env");
const sequelize = require("./lib/database");

const start = async () => {
  await sequelize.sync();
  app.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`);
  });
};

start();
