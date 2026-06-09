const sequelize = require("../../lib/database");

const { Model, DataTypes } = require("sequelize");

class Setting extends Model {}
Setting.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    singleton_guard: {
      type: DataTypes.INTEGER,
      unique: true,
      defaultValue: 1,
    },
    restaurant_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    footer_message: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    currency: {
      type: DataTypes.ENUM("USD", "KHR"),
      defaultValue: "USD",
    },
    logo_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  { sequelize, underscored: true, timestamps: true, modelName: "setting" },
);

module.exports = Setting;
