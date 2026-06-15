const {
  Table_Session,
  Table,
  Order,
  OrderItem,
  User,
} = require("../models/index");
const { getIO } = require("../../lib/socket");

const openSession = async (data) => {
  const { tableId } = data;

  const existingSession = await Table_Session.findOne({
    where: { tableId, status: "OPEN" },
  });

  if (existingSession) throw new Error("Table is already occupied");

  await Table_Session.create({ tableId });
  await Table.update({ status: "OCCUPIED" }, { where: { id: tableId } });
  const io = getIO();
  io.to("staff")
    .to("admin")
    .emit("table:update", { id: tableId, status: "OCCUPIED" });

  const session = await Table_Session.findOne({
    where: { tableId, status: "OPEN" },
    include: [
      { model: Table, as: "table", attributes: ["id", "table_number"] },
    ],
  });

  return session;
};

const getActiveSessionByTable = async (data) => {
  const { tableId } = data;
  const activeSession = await Table_Session.findOne({
    where: { tableId, status: "OPEN" },
    include: [
      {
        model: Table,
        as: "table",
        attributes: ["id", "table_number"],
      },
    ],
  });

  return activeSession;
};

const getSessionOrders = async (data) => {
  const { sessionId } = data;

  const sessionOrder = await Order.findAll({
    where: { sessionId },
    attributes: ["id", "tableNumber", "status", "total"],
    include: [
      {
        model: OrderItem,
        as: "items",
        attributes: ["menuName", "price", "quantity", "subtotal"],
      },
      { model: User, as: "creator", attributes: ["id", "name"] },
    ],
  });

  return sessionOrder;
};

const closeSession = async (data) => {
  const { sessionId } = data;
  const session = await Table_Session.findOne({
    where: { id: sessionId },
  });
  if (!session) throw new Error("Session not found!");
  if (session.status === "CLOSED") throw new Error("Session already closed");
  await Table_Session.update(
    { closedAt: new Date(), status: "CLOSED" },
    { where: { id: sessionId } },
  );

  await Table.update(
    { status: "AVAILABLE" },
    { where: { id: session.tableId } },
  );
  const updatedSession = await Table_Session.findOne({
    where: { id: sessionId },
  });
  return updatedSession;
};

module.exports = {
  openSession,
  getActiveSessionByTable,
  getSessionOrders,
  closeSession,
};
