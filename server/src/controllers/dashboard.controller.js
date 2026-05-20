const dashboardServices = require("../services/dashboard.service");

const getDashboardSummary = async (request, response) => {
  try {
    const summary = await dashboardServices.getDashboardSummary();
    return response.status(200).json({ summary });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
};

module.exports = { getDashboardSummary };
