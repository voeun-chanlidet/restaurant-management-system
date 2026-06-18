import { useState, useEffect, useCallback, useMemo } from "react";
import OrderService from "../../services/order";
import OrderList from "./OrderList";
import OrderDetailModal from "./OrderDetailModal";
import useOrderSocket from "../../hooks/useOrderSocket";
import toast from "react-hot-toast";

const STATUS_OPTIONS = [
  "ALL",
  "PENDING",
  "IN_PROGRESS",
  "READY",
  "SERVED",
  "CANCELLED",
];

const TYPE_OPTIONS = ["ALL", "Dine In", "QR Order"];

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterType, setFilterType] = useState("ALL");
  const [searchTable, setSearchTable] = useState("");

  // =========================
  // FETCH
  // =========================
  const fetchOrders = async () => {
    try {
      const data = await OrderService.getAllOrders();
      setOrders(data.orders);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // =========================
  // SOCKET
  // =========================
  const handleNewOrder = useCallback((order) => {
    setOrders((prev) => [order, ...prev]);
  }, []);

  const handleOrderUpdate = useCallback((order) => {
    setOrders((prev) => prev.map((o) => (o.id === order.id ? order : o)));
  }, []);

  const handleOrderCancel = useCallback((order) => {
    setOrders((prev) => prev.map((o) => (o.id === order.id ? order : o)));
  }, []);

  useOrderSocket({
    onNewOrder: handleNewOrder,
    onOrderUpdate: handleOrderUpdate,
    onOrderCancel: handleOrderCancel,
  });

  // =========================
  // MODAL
  // =========================
  const openDetail = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const closeDetail = () => {
    setSelectedOrder(null);
    setShowDetailModal(false);
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await OrderService.updateOrderStatus(id, status);
      toast.success("Order status updated successfully.");
      await fetchOrders();
      closeDetail();
    } catch (error) {
      toast.error(error.response?.data?.error || "Update status failed");
    }
  };

  const handleCancelOrder = async (id) => {
    try {
      await OrderService.cancelOrder(id);
      toast.success("Order cancelled successfully.");
      await fetchOrders();
      closeDetail();
    } catch (error) {
      toast.error(error.response?.data?.error || "Cancel order failed.");
    }
  };

  // FILTER

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchStatus = filterStatus === "ALL" || o.status === filterStatus;

      const matchType = filterType === "ALL" || o.orderType === filterType;

      const matchTable =
        searchTable === "" ||
        o.tableNumber?.toLowerCase().includes(searchTable.toLowerCase());

      return matchStatus && matchType && matchTable;
    });
  }, [orders, filterStatus, filterType, searchTable]);

  // =========================
  // SUMMARY COUNTERS
  // =========================
  const summary = useMemo(() => {
    const active = orders.filter(
      (o) => o.status !== "SERVED" && o.status !== "CANCELLED",
    ).length;

    const pending = orders.filter((o) => o.status === "PENDING").length;

    const ready = orders.filter((o) => o.status === "READY").length;

    return { active, pending, ready };
  }, [orders]);

  // =========================
  // UI
  // =========================
  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-heading">Orders Overview</h1>
          <p className="text-sm text-dimmed">
            Real-time monitoring of all restaurant orders
          </p>
        </div>
        <div className="flex gap-3 text-sm">
          <div className="bg-panel px-4 py-2 rounded-lg border border-panel-border">
            Active:{" "}
            <span className="text-heading font-semibold">{summary.active}</span>
          </div>
          <div className="bg-panel px-4 py-2 rounded-lg border border-panel-border">
            Pending:{" "}
            <span className="text-yellow-600 font-semibold">
              {summary.pending}
            </span>
          </div>
          <div className="bg-panel px-4 py-2 rounded-lg border border-panel-border">
            Ready:{" "}
            <span className="text-green-600 font-semibold">
              {summary.ready}
            </span>
          </div>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition ${
                filterStatus === s
                  ? "bg-brand text-white"
                  : "bg-panel border border-panel-border text-dimmed hover:text-heading"
              }`}
            >
              {s.replace("_", " ")}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {TYPE_OPTIONS.map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition ${
                filterType === t
                  ? "bg-brand text-white"
                  : "bg-panel border border-panel-border text-dimmed hover:text-heading"
              }`}
            >
              {t}
            </button>
          ))}
          <input
            type="text"
            placeholder="Search table..."
            value={searchTable}
            onChange={(e) => setSearchTable(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-lg bg-panel border border-panel-border text-heading placeholder:text-dimmed focus:outline-none focus:border-brand"
          />
        </div>
      </div>

      {/* ORDER LIST */}
      <OrderList orders={filteredOrders} onCardClick={openDetail} />

      {/* MODAL */}
      {showDetailModal && selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={closeDetail}
          onStatusUpdate={handleStatusUpdate}
          onCancel={handleCancelOrder}
        />
      )}
    </div>
  );
};

export default OrderPage;
