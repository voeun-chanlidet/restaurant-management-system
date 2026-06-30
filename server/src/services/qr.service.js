const { Order, OrderItem, Table, Menu, Table_Session } = require("../models");

const createQROrder = async (data) => {
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
      orderType: "QR",
      tableId,
      sessionId,
      tableNumber: table.table_number, // snapshot
      status: "PENDING",
      total,
      items: orderItems,
    },
    { include: [{ model: OrderItem, as: "items" }] },
  );

  //refetch for better response
  const freshOrder = await Order.findByPk(order.id, {
    attributes: [
      "id",
      "orderType",
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
    ],
  });

  return freshOrder;
};

module.exports = { createQROrder };
