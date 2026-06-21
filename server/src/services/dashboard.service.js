const { Op } = require("sequelize");
const {
  Order,
  Payment,
  OrderItem,
  Menu,
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

  //it's a bit complex so using raw SQL for this one
  const [topOrders] = await sequelize.query(`
  SELECT 
    oi."menu_name",
    oi.menu_id AS "menuId",
    SUM(oi.quantity) AS "totalQuantity",
    SUM(oi.subtotal) AS "totalSubtotal",
    m."image_url"
  FROM order_items oi
  LEFT JOIN menus m ON oi.menu_id = m.id
  GROUP BY oi."menu_name", oi.menu_id, m."image_url"
  ORDER BY SUM(oi.quantity) DESC
  LIMIT 5
`);

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
    topOrders: topOrders.map((item) => ({
      menuName: item.menu_name,
      totalQuantity: item.totalQuantity,
      totalSubtotal: item.totalSubtotal,
      imageUrl: item.image_url ?? null,
    })),
    recentPayments,
  };
};

module.exports = { getDashboardSummary };
