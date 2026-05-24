const { Sequelize } = require("sequelize");
const { env } = require("../src/config/env");
console.log("DB URL in database.js:", env.databaseUrl);
const sequelize = new Sequelize(env.databaseUrl, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

module.exports = sequelize;
