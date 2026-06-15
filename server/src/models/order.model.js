const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../lib/database");

class Order extends Model {}

Order.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    orderType: {
      type: DataTypes.ENUM("DINE_IN", "QR"),
      defaultValue: "DINE_IN",
      allowNull: false,
    },
    tableId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "tables", key: "id" },
      onDelete: "SET NULL",
    },
    sessionId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "table_sessions", key: "id" },
    },
    tableNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        "PENDING",
        "IN_PROGRESS",
        "READY",
        "SERVED",
        "CANCELLED",
      ),
      defaultValue: "PENDING",
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: true, //change from false because there's no staff to create order via QR
      references: { model: "users", key: "id" },
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: "order",
  },
);

module.exports = Order;
