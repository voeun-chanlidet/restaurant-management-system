const sequelize = require("../../lib/database");

const { Model, DataTypes } = require("sequelize");

class Table_Session extends Model {}
Table_Session.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tableId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "tables", key: "id" },
      onDelete: "SET NULL",
    },
    openedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    closedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("OPEN", "CLOSED"),
      defaultValue: "OPEN",
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: "table_sessions",
  },
);

module.exports = Table_Session;
