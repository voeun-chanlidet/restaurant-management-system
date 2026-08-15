const { Sequelize } = require("sequelize");
const { env } = require("../src/config/env");

const sequelize = new Sequelize(env.databaseUrl, {
  dialect: "postgres",
  dialectOptions:
    env.nodeEnv === "development"
      ? {}
      : {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
  logging: false,
});

module.exports = sequelize;
