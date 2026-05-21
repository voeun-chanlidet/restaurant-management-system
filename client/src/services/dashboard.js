import api from "./api";

const getDashboardSummary = async () => {
  const res = await api.get("/dashboard");
  return res.data;
};
export default {
  getDashboardSummary,
};
