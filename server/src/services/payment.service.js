const {
  Payment,
  Order,
  User,
  OrderItem,
  Table_Session,
  Table,
} = require("../models/index");
const { closeSession } = require("./session.service");
const { Op } = require("sequelize");

const createPayment = async (data, userId) => {
  let { sessionId, method, cashReceived, currency, exchangeRate } = data;
  const session = await Table_Session.findByPk(sessionId);
  if (!session) throw new Error("Session not found!");

  if (session.status !== "OPEN") throw new Error("Session must be open!");

  const orders = await Order.findAll({
    where: { sessionId, status: { [Op.ne]: "CANCELLED" } },
  });
  if (orders.length === 0)
    throw new Error("Cannot pay a session with no orders!");

  if (orders.length === 0)
    throw new Error("Cannot pay a session with no orders!");

  const unfinishedOrders = orders.filter(
    (o) =>
      o.status === "PENDING" ||
      o.status === "IN_PROGRESS" ||
      o.status === "READY",
  );

  if (unfinishedOrders.length > 0)
    throw new Error("All orders must be Served before payment!");

  const grandTotal = orders.reduce(
    (sum, order) => sum + parseFloat(order.total),
    0,
  );

  let change = null;
  let cashReceivedKhr = null;
  let cashReceivedUsd = null;
  let changeKhr = null;
  let changeUsd = null;

  if (method === "CASH") {
    if (!cashReceived) throw new Error("Payment amount is required!");

    if (currency === "KHR") {
      const grandTotalKhr = Math.round(grandTotal * exchangeRate);
      if (parseFloat(cashReceived) < grandTotalKhr)
        throw new Error("Insufficient amount!");

      cashReceivedKhr = Math.round(parseFloat(cashReceived));
      changeKhr = cashReceivedKhr - grandTotalKhr;
      cashReceivedUsd = cashReceivedKhr / exchangeRate;
      changeUsd = changeKhr / exchangeRate;
      change = changeUsd;
      cashReceived = cashReceivedUsd;
    } else {
      if (parseFloat(cashReceived) < grandTotal)
        throw new Error("Insufficient amount!");

      cashReceivedUsd = parseFloat(cashReceived);
      changeUsd = cashReceivedUsd - grandTotal;
      change = changeUsd;
    }
  }

  if (method === "KHQR") {
    cashReceived = null;
    change = null;
  }

  const payment = await Payment.create({
    sessionId,
    method,
    totalAmount: grandTotal,
    cashReceived,
    change,
    cashReceivedKhr,
    cashReceivedUsd,
    changeKhr,
    changeUsd,
    displayCurrency: currency || "USD",
    processedBy: userId,
  });
  await closeSession({ sessionId });
  const freshPayment = await Payment.findByPk(payment.id, {
    attributes: [
      "id",
      "sessionId",
      "method",
      "totalAmount",
      "cashReceived",
      "change",
      "cashReceivedKhr",
      "cashReceivedUsd",
      "changeKhr",
      "changeUsd",
      "displayCurrency",
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
            where: { status: { [Op.ne]: "CANCELLED" } },
            required: false,
            attributes: ["id", "total", "status"],
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
      "totalAmount",
      "cashReceived",
      "change",
      "cashReceivedKhr",
      "cashReceivedUsd",
      "changeKhr",
      "changeUsd",
      "displayCurrency",
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
      "totalAmount",
      "cashReceived",
      "change",
      "cashReceivedKhr",
      "cashReceivedUsd",
      "changeKhr",
      "changeUsd",
      "displayCurrency",
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
