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
    sessionId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "table_sessions", key: "id" },
    },
    method: {
      type: DataTypes.ENUM("CASH", "KHQR"),
      allowNull: false,
      defaultValue: "CASH",
    },
    cashReceived: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: "amount_tendered",
    },
    change: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
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
