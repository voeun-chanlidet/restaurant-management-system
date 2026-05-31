const {
  Payment,
  Order,
  User,
  OrderItem,
  Table_Session,
  Table,
} = require("../models/index");
const { closeSession } = require("./session.service");

const createPayment = async (data, userId) => {
  let { sessionId, method, amountTendered } = data;
  const session = await Table_Session.findByPk(sessionId);
  if (!session) throw new Error("Session not found!");

  if (session.status !== "OPEN") throw new Error("Session must be open!");

  const orders = await Order.findAll({ where: { sessionId } });

  const grandTotal = orders.reduce(
    (sum, order) => sum + parseFloat(order.total),
    0,
  );

  let change = null;
  if (method === "CASH") {
    if (!amountTendered) throw new Error("Payment amount is required!");
    if (amountTendered < grandTotal) throw new Error("Insufficient amount!");

    change = parseFloat(amountTendered) - parseFloat(grandTotal);
  }
  if (method === "KHQR") {
    amountTendered = null;
    change = null;
  }

  const payment = await Payment.create({
    sessionId,
    method,
    totalAmount: grandTotal,
    amountTendered,
    change,
    processedBy: userId,
  });

  await closeSession({ sessionId });
  const freshPayment = await Payment.findByPk(payment.id, {
    attributes: [
      "id",
      "sessionId",
      "method",
      "totalAmount",
      "amountTendered",
      "change",
      "createdAt",
    ],
    include: [
      {
        model: Table_Session,
        as: "session",
        attributes: ["id", "openedAt", "closedAt"],
        include: [
          {
            model: Table,
            attributes: ["id", "table_number"],
          },
          {
            model: Order,

            attributes: ["id", "total"],
            include: [
              {
                model: OrderItem,
                as: "items",
                attributes: ["menuName", "price", "quantity", "subtotal"],
              },
            ],
          },
        ],
      },

      { model: User, as: "processor", attributes: ["id", "name"] },
    ],
  });
  return freshPayment;
};

const getPaymentBySession = async (data) => {
  const { sessionId } = data;

  const payment = await Payment.findOne({
    where: { sessionId },
    attributes: [
      "id",
      "sessionId",
      "method",
      "amountTendered",
      "change",
      "createdAt",
    ],
    include: [
      {
        model: Table_Session,
        as: "session",
        attributes: ["id", "openedAt", "closedAt"],
        include: [
          {
            model: Table,
            attributes: ["id", "table_number"],
          },
          {
            model: Order,

            attributes: ["id", "total"],
            include: [
              {
                model: OrderItem,
                as: "items",
                attributes: ["menuName", "price", "quantity", "subtotal"],
              },
            ],
          },
        ],
      },

      { model: User, as: "processor", attributes: ["id", "name"] },
    ],
  });
  if (!payment) throw new Error("Payment not found!");
  return payment;
};

const getAllPayments = async () => {
  return await Payment.findAll({
    attributes: [
      "id",
      "sessionId",
      "method",
      "amountTendered",
      "change",
      "createdAt",
    ],
    include: [
      {
        model: Table_Session,
        as: "session",
        attributes: ["id", "openedAt", "closedAt"],
        include: [
          {
            model: Table,
            attributes: ["id", "table_number"],
          },
          {
            model: Order,

            attributes: ["id", "total"],
            include: [
              {
                model: OrderItem,
                as: "items",
                attributes: ["menuName", "price", "quantity", "subtotal"],
              },
            ],
          },
        ],
      },

      { model: User, as: "processor", attributes: ["id", "name"] },
    ],
    order: [["createdAt", "DESC"]],
  });
};

module.exports = {
  getPaymentBySession,
  getAllPayments,
  createPayment,
};
