const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../lib/database");

class Payment extends Model {}
Payment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: { model: "orders", key: "id" },
    },
    method: {
      type: DataTypes.ENUM("CASH", "KHQR"),
      allowNull: false,
      defaultValue: "CASH",
    },
    amountTendered: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    change: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    processedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: "payment",
  },
);

module.exports = Payment;
