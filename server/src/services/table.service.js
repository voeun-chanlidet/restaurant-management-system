const { Table, Table_Session } = require("../models");

const getAllTables = async () => {
  return await Table.findAll();
};

const getTableById = async (id) => {
  const table = await Table.findByPk(id);
  if (!table) throw new Error("Table not found!");
  return table;
};

const createTable = async (table_number, capacity, status, shape) => {
  const table = await Table.create({ table_number, capacity, status, shape });
  return table;
};

const updateTable = async (id, data) => {
  const table = await Table.findByPk(id);
  if (!table) throw new Error("Table not found!");

  return await table.update(data);
};

const deleteTable = async (id) => {
  const table = await Table.findByPk(id);
  if (!table) throw new Error("Table not found!");

  const openSession = await Table_Session.findOne({
    where: { tableId: id, status: "OPEN" },
  });
  if (openSession)
    throw new Error("Cannot delete a table that has an open session!");

  await table.destroy();
};

module.exports = {
  getAllTables,
  getTableById,
  createTable,
  updateTable,
  deleteTable,
};
