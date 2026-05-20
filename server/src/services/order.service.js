const { Order, OrderItem, Table, User, Menu, Payment } = require("../models");
const { Op, Sequelize } = require("sequelize");

const getAllOrders = async () => {
  return await Order.findAll({
    attributes: [
      "id",
      "tableId",
      "tableNumber",
      "status",
      "total",
      "createdAt",
      "updatedAt",
    ],
    include: [
      {
        model: OrderItem,
        as: "items",
        attributes: ["id", "menuName", "price", "quantity", "subtotal"],
      },
      { model: User, as: "creator", attributes: ["id", "name"] },
    ],
    order: [["createdAt", "DESC"]],
  });
};

const getOrderById = async (id) => {
  const order = await Order.findByPk(id, {
    attributes: [
      "id",
      "tableId",
      "tableNumber",
      "status",
      "total",
      "createdAt",
      "updatedAt",
    ],
    include: [
      {
        model: OrderItem,
        as: "items",
        attributes: ["id", "menuName", "price", "quantity", "subtotal"],
      },
      { model: User, as: "creator", attributes: ["id", "name"] },
    ],
  });
  if (!order) throw new Error("Order not found!");
  return order;
};

const createOrder = async (data, userId) => {
  const { tableId, items } = data;

  // Validate table exists
  const table = await Table.findByPk(tableId);
  if (!table) throw new Error("Table not found!");

  // Validate items
  if (!items || items.length === 0)
    throw new Error("Order must have at least one item!");

  // Build order items with snapshots
  let total = 0;
  const orderItems = [];

  for (const item of items) {
    const menu = await Menu.findByPk(item.menuId);
    if (!menu) throw new Error(`Menu item ${item.menuId} not found!`);
    if (!menu.isAvailable)
      throw new Error(`${menu.name} is currently unavailable!`);

    const subtotal = parseFloat(menu.price) * item.quantity;
    total += subtotal;

    orderItems.push({
      menuId: menu.id,
      menuName: menu.name, // snapshot
      price: menu.price, // snapshot
      quantity: item.quantity,
      subtotal,
    });
  }

  // Create order + items in one transaction
  const order = await Order.create(
    {
      tableId,
      tableNumber: table.table_number, // snapshot
      status: "PENDING",
      total,
      createdBy: userId,
      items: orderItems,
    },
    { include: [{ model: OrderItem, as: "items" }] },
  );
  //refetch for better response
  const freshOrder = await Order.findByPk(order.id, {
    attributes: [
      "id",
      "tableId",
      "tableNumber",
      "status",
      "total",
      "createdAt",
      "updatedAt",
    ],
    include: [
      {
        model: OrderItem,
        as: "items",
        attributes: ["id", "menuName", "price", "quantity", "subtotal"],
      },
      { model: User, as: "creator", attributes: ["id", "name"] },
    ],
  });

  return freshOrder;
};

const updateOrderStatus = async (id, status, userRole) => {
  const order = await Order.findByPk(id);
  if (!order) throw new Error("Order not found!");

  const allowedStatuses = [
    "PENDING",
    "IN_PROGRESS",
    "READY",
    "SERVED",
    "CANCELLED",
  ];
  if (!allowedStatuses.includes(status)) throw new Error("Invalid status!");

  // KITCHEN can only move status forward — not cancel
  if (userRole === "KITCHEN" && status === "CANCELLED") {
    throw new Error("Kitchen cannot cancel orders!");
  }

  // STAFF can only edit PENDING orders
  if (userRole === "STAFF" && order.status !== "PENDING") {
    throw new Error("Staff can only update orders that are still pending!");
  }

  order.status = status;
  await order.save();
  //refetch for better response
  const updatedOrder = await Order.findByPk(order.id, {
    attributes: [
      "id",
      "tableId",
      "tableNumber",
      "status",
      "total",
      "createdAt",
      "updatedAt",
    ],
    include: [
      {
        model: OrderItem,
        as: "items",
        attributes: ["id", "menuName", "price", "quantity", "subtotal"],
      },
      { model: User, as: "creator", attributes: ["id", "name"] },
    ],
  });

  return updatedOrder;
};

const cancelOrder = async (id, userRole) => {
  const order = await Order.findByPk(id);
  if (!order) throw new Error("Order not found!");

  if (order.status === "SERVED")
    throw new Error("Cannot cancel an already served order!");
  if (order.status === "CANCELLED")
    throw new Error("Order is already cancelled!");

  order.status = "CANCELLED";
  await order.save();

  //refetch for better response
  const canceledOrder = await Order.findByPk(order.id, {
    attributes: [
      "id",
      "tableId",
      "tableNumber",
      "status",
      "total",
      "createdAt",
      "updatedAt",
    ],
    include: [
      {
        model: OrderItem,
        as: "items",
        attributes: ["id", "menuName", "price", "quantity", "subtotal"],
      },
      { model: User, as: "creator", attributes: ["id", "name"] },
    ],
  });

  return canceledOrder;
};

const getUnpaidServedOrders = async () => {
  // Get all paid order IDs first
  const paidOrderIds = await Payment.findAll({
    attributes: ["orderId"],
  });
  const paidIds = paidOrderIds.map((p) => p.orderId);

  // Find SERVED orders not in that list
  return await Order.findAll({
    where: {
      status: "SERVED",
      id: { [Op.notIn]: paidIds.length > 0 ? paidIds : [0] },
    },
    include: [
      {
        model: OrderItem,
        as: "items",
        attributes: ["menuName", "price", "quantity", "subtotal"],
      },
      { model: User, as: "creator", attributes: ["id", "name"] },
    ],
    attributes: ["id", "tableNumber", "total", "createdAt"],
    order: [["createdAt", "ASC"]],
  });
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  getUnpaidServedOrders,
};
