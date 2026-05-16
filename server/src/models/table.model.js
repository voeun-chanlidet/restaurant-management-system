const sequelize = require("../../lib/database");

const { Model, DataTypes } = require("sequelize");

class Table extends Model {}
Table.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    table_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("AVAILABLE", "OCCUPIED", "RESERVED", "MAINTENANCE"),
      defaultValue: "AVAILABLE",
      allowNull: false,
    },
    shape: {
      type: DataTypes.ENUM("round", "rect"),
      defaultValue: "round",
      allowNull: false,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: "table",
  },
);

module.exports = Table;
