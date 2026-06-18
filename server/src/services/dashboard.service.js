const { Op } = require("sequelize");
const {
  Order,
  Payment,
  OrderItem,
  User,
  Table_Session,
  Table,
} = require("../models/index");
const sequelize = require("../../lib/database");

const getDashboardSummary = async () => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const revenueResult = await Payment.findAll({
    attributes: [
      [sequelize.fn("SUM", sequelize.col("total_amount")), "totalRevenue"],
    ],
    where: {
      createdAt: {
        [Op.between]: [todayStart, todayEnd],
      },
    },
    raw: true,
  });

  const todayRevenue = revenueResult[0]?.totalRevenue || 0;

  const todayOrders = await Order.findAll({
    where: {
      createdAt: {
        [Op.between]: [todayStart, todayEnd],
      },
    },
    attributes: [
      "status",
      [sequelize.fn("COUNT", sequelize.col("status")), "statusCount"],
    ],
    group: ["status"],
  });
  const allTables = await Table.count();
  const activeTables = await Table.count({ where: { status: "OCCUPIED" } });
  const topOrders = await OrderItem.findAll({
    attributes: [
      "menuName",
      [sequelize.fn("SUM", sequelize.col("quantity")), "totalQuantity"],
      [sequelize.fn("SUM", sequelize.col("subtotal")), "totalSubtotal"],
    ],
    group: ["menuName"],
    order: [[sequelize.fn("SUM", sequelize.col("quantity")), "DESC"]],
    limit: 5,
  });

  const recentPayments = await Payment.findAll({
    attributes: ["id", "method", "totalAmount", "createdAt"],
    order: [["createdAt", "DESC"]],
    limit: 5,
    include: [
      {
        model: Table_Session,
        as: "session",
        attributes: ["id"],
        include: [{ model: Table, attributes: ["table_number"] }],
      },
      { model: User, attributes: ["name"], as: "processor" },
    ],
  });
  return {
    todayRevenue,
    todayOrders,
    activeTables,
    allTables,
    topOrders,
    recentPayments,
  };
};

module.exports = { getDashboardSummary };
