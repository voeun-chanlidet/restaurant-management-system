const { Payment, Order, User, OrderItem } = require("../models/index");

const createPayment = async (data, userId) => {
  let { orderId, method, amountTendered } = data;
  const order = await Order.findByPk(orderId);
  if (!order) throw new Error("Order not found!");

  if (order.status !== "SERVED") throw new Error("Order must be served!");

  const existingPayment = await Payment.findOne({ where: { orderId } });
  if (existingPayment) throw new Error("Order is already paid!");
  let change = null;
  if (method === "CASH") {
    if (!amountTendered) throw new Error("Payment amount is required!");
    if (amountTendered < order.total) throw new Error("Insufficient amount!");

    change = parseFloat(amountTendered) - parseFloat(order.total);
  }
  if (method === "KHQR") {
    amountTendered = null;
    change = null;
  }

  const payment = await Payment.create({
    orderId,
    method,
    amountTendered,
    change,
    processedBy: userId,
  });
  const freshPayment = await Payment.findByPk(payment.id, {
    attributes: ["id", "method", "amountTendered", "change", "createdAt"],
    include: [
      {
        model: Order,
        as: "order",
        attributes: ["id", "tableNumber", "total"],
        include: [
          {
            model: OrderItem,
            as: "items",
            attributes: ["menuName", "price", "quantity", "subtotal"],
          },
        ],
      },

      { model: User, as: "processor", attributes: ["id", "name"] },
    ],
  });
  return freshPayment;
};

const getPaymentByOrder = async (data) => {
  const { orderId } = data;

  const payment = await Payment.findOne({
    where: { orderId },
    attributes: ["id", "method", "amountTendered", "change", "createdAt"],
    include: [
      {
        model: Order,
        as: "order",
        attributes: ["id", "tableNumber", "total"],
        include: [
          {
            model: OrderItem,
            as: "items",
            attributes: ["menuName", "price", "quantity", "subtotal"],
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
    attributes: ["id", "method", "amountTendered", "change", "createdAt"],
    include: [
      {
        model: Order,
        as: "order",
        attributes: ["id", "tableNumber", "total"],
        include: [
          {
            model: OrderItem,
            as: "items",
            attributes: ["menuName", "price", "quantity", "subtotal"],
          },
        ],
      },

      { model: User, as: "processor", attributes: ["id", "name"] },
    ],
    order: [["createdAt", "DESC"]],
  });
};

module.exports = {
  getPaymentByOrder,
  getAllPayments,
  createPayment,
};
