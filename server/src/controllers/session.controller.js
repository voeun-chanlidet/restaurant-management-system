const sessionServices = require("../services/session.service");

const openSession = async (request, response) => {
  try {
    const data = { tableId: request.body.tableId };
    const session = await sessionServices.openSession(data);
    return response.status(201).json({ session });
  } catch (error) {
    return response.status(400).json({
      error: error.message,
    });
  }
};

const getActiveSessionByTable = async (request, response) => {
  try {
    const data = { tableId: request.params.tableId };
    const activeSession = await sessionServices.getActiveSessionByTable(data);
    return response.status(200).json({ activeSession });
  } catch (error) {
    return response.status(500).json({
      error: error.message,
    });
  }
};

const getSessionOrders = async (request, response) => {
  try {
    const data = { sessionId: request.params.sessionId };
    const sessionOrder = await sessionServices.getSessionOrders(data);
    return response.status(200).json({ sessionOrder });
  } catch (error) {
    return response.status(500).json({
      error: error.message,
    });
  }
};

const closeSession = async (request, response) => {
  try {
    const data = { sessionId: request.params.sessionId };
    const closedSession = await sessionServices.closeSession(data);
    return response.status(200).json({ closedSession });
  } catch (error) {
    return response.status(500).json({
      error: error.message,
    });
  }
};

module.exports = {
  openSession,
  getActiveSessionByTable,
  getSessionOrders,
  closeSession,
};
