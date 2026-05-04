const sequelize = require("../../lib/database");

const { Model, DataTypes } = require("sequelize");

class Category extends Model {}
Category.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: { notEmpty: true },
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: "category",
  },
);

module.exports = Category;
