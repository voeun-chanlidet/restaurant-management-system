const { getIO } = require("../../lib/socket");
const TableServices = require("../services/table.service");

const getAllTables = async (request, response) => {
  try {
    const tables = await TableServices.getAllTables();
    return response.status(200).json({ tables });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
};

const createTable = async (request, response) => {
  try {
    const { table_number, capacity, status, shape } = request.body;
    const newTable = await TableServices.createTable(
      table_number,
      capacity,
      status,
      shape,
    );
    return response.status(201).json({ table: newTable });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
};

const updateTable = async (request, response) => {
  try {
    const id = request.params.id;
    const data = request.body;
    const updatedTable = await TableServices.updateTable(id, data);
    const io = getIO();
    io.to(["staff", "admin"]).emit("table:update", updatedTable);
    return response.status(200).json({ table: updatedTable });
  } catch (error) {
    const status = error.message === "Table not found!" ? 404 : 500;
    return response.status(status).json({ error: error.message });
  }
};

const deleteTable = async (request, response) => {
  try {
    const id = request.params.id;
    await TableServices.deleteTable(id);
    return response.status(200).json({ status: "success", data: null });
  } catch (error) {
    const status = error.message === "Table not found!" ? 404 : 500;
    return response.status(status).json({ error: error.message });
  }
};

module.exports = {
  getAllTables,
  createTable,
  updateTable,
  deleteTable,
};
