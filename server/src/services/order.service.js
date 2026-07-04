const { getIO } = require("../../lib/socket");
const {
  Order,
  OrderItem,
  Table,
  User,
  Menu,
  Payment,
  Table_Session,
} = require("../models");
const { Op, Sequelize, where } = require("sequelize");

const getAllOrders = async () => {
  return await Order.findAll({
    attributes: [
      "id",
      "tableId",
      "tableNumber",
      "status",
      "total",
      "orderType",
      "createdAt",
      "updatedAt",
    ],
    include: [
      {
        model: OrderItem,
        as: "items",
        attributes: ["id", "menuName", "price", "quantity", "subtotal", "note"],
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
      "orderType",
      "createdAt",
      "updatedAt",
    ],
    include: [
      {
        model: OrderItem,
        as: "items",
        attributes: [
          "id",
          "menuName",
          "price",
          "quantity",
          "subtotal",
          "note",
          "imageUrl",
        ],
      },
      { model: User, as: "creator", attributes: ["id", "name"] },
    ],
  });
  if (!order) throw new Error("Order not found!");
  return order;
};

const createOrder = async (data, userId) => {
  const { tableId, items, sessionId } = data;

  // Validate table exists
  const table = await Table.findByPk(tableId);
  if (!table) throw new Error("Table not found!");

  const session = await Table_Session.findOne({
    where: { id: sessionId, status: "OPEN" },
  });
  if (!session) throw new Error("Session not found!");

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
      imageUrl: menu.imageUrl, // snapshot
      quantity: item.quantity,
      note: item.note || null,
      subtotal,
    });
  }

  // Create order + items in one transaction
  const order = await Order.create(
    {
      tableId,
      sessionId,
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
      "sessionId",
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
        attributes: [
          "id",
          "menuName",
          "price",
          "quantity",
          "subtotal",
          "note",
          "imageUrl",
        ],
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

  const STATUS_FLOW = {
    PENDING: ["IN_PROGRESS"],
    IN_PROGRESS: ["READY"],
    READY: ["SERVED"],
    SERVED: [],
    CANCELLED: [],
  };

  const allowedNext = STATUS_FLOW[order.status];
  if (!allowedNext.includes(status)) {
    throw new Error(`Cannot move order from ${order.status} to ${status}!`);
  }
  // KITCHEN can only move IN_PROGRESS → READY
  if (userRole === "KITCHEN" && order.status !== "IN_PROGRESS") {
    throw new Error("Kitchen can only mark IN_PROGRESS orders as Ready!");
  }

  // KITCHEN can only move status forward — not cancel
  if (userRole === "KITCHEN" && status === "CANCELLED") {
    throw new Error("Kitchen cannot cancel orders!");
  }

  // STAFF can only edit PENDING orders
  // if (userRole === "STAFF" && order.status !== "PENDING") {
  //   throw new Error("Staff can only update orders that are still pending!");
  // }

  order.status = status;
  await order.save();
  console.log("order.tableId:", order.tableId);
  if (status === "SERVED" && order.tableId) {
    const activeOrders = await Order.count({
      where: {
        tableId: order.tableId,
        status: ["PENDING", "IN_PROGRESS", "READY"],
      },
    });
    if (activeOrders === 0) {
      await Table.update(
        { status: "AVAILABLE" },
        { where: { id: order.tableId } },
      );
    }
  }
  //refetch for better response
  const updatedOrder = await Order.findByPk(order.id, {
    attributes: [
      "id",
      "tableId",
      "sessionId",
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
        attributes: ["id", "menuName", "price", "quantity", "subtotal", "note"],
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

  const canceledOrder = await Order.findByPk(order.id, {
    attributes: [
      "id",
      "sessionId",
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

  const io = getIO();
  io.to(["kitchen", "staff", "admin"]).emit("order:cancelled", canceledOrder);
  io.to(`customer:${canceledOrder.sessionId}`).emit("order:statusUpdated", {
    orderId: canceledOrder.id,
    status: canceledOrder.status,
  });

  return canceledOrder;
};

const getUnpaidServedOrders = async () => {
  const sessions = await Table_Session.findAll({
    where: { status: "OPEN" },
    include: [
      {
        model: Table,
        attributes: ["id", "table_number"],
      },
      {
        model: Order,
        as: "orders",
        where: { status: "SERVED" },
        required: true,
        include: [
          {
            model: OrderItem,
            as: "items",
            attributes: ["menuName", "price", "quantity", "subtotal"],
          },
          { model: User, as: "creator", attributes: ["id", "name"] },
        ],
        attributes: [
          "id",
          "tableNumber",
          "total",
          "status",
          "orderType",
          "createdAt",
        ],
      },
    ],
    attributes: ["id", "openedAt", "status"],
    order: [["openedAt", "ASC"]],
  });

  return sessions.map((session) => {
    const orders = session.orders;
    const runningTotal = orders.reduce((sum, o) => sum + Number(o.total), 0);
    const allItems = orders.flatMap((o) => o.items);

    return {
      id: session.id,
      tableNumber: session.table?.table_number,
      openedAt: session.openedAt,
      runningTotal,
      orders,
      allItems,
    };
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
