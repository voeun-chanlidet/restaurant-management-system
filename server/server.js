require("dotenv").config();
const http = require("http");
const app = require("./app");
const { env } = require("./src/config/env");
const sequelize = require("./lib/database");
const { initSocket } = require("./lib/socket");
require("./src/models/index");

const server = http.createServer(app);
initSocket(server);

const start = async () => {
  console.log("DB URL:", process.env.DATABASE_URL);
  await sequelize.sync({ alter: true });
  server.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`);
  });
};

start();
