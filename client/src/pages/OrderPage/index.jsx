import { useState, useEffect, useCallback, useMemo } from "react";
import OrderService from "../../services/order";
import OrderList from "./OrderList";
import OrderDetailModal from "./OrderDetailModal";
import useOrderSocket from "../../hooks/useOrderSocket";
import toast from "react-hot-toast";

const STATUS_OPTIONS = [
  { value: "ALL", label: "ALL" },
  { value: "PENDING", label: "PENDING" },
  { value: "IN_PROGRESS", label: "IN PROGRESS" },
  { value: "READY", label: "READY" },
  { value: "SERVED", label: "SERVED" },
  { value: "CANCELLED", label: "CANCELLED" },
];

const ITEMS_PER_PAGE = 12;

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterType, setFilterType] = useState("ALL");
  const [searchTable, setSearchTable] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchOrders = async () => {
    try {
      const data = await OrderService.getAllOrders();
      setOrders(data.orders || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load orders!");
    }
  };
  useEffect(() => {
    // FETCH
    fetchOrders();
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, filterType, searchTable]);

  // SOCKET
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

  // MODAL HANDLERS
  const openDetail = async (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
    setDetailLoading(true);
    try {
      const data = await OrderService.getOrderById(order.id);
      setSelectedOrder(data.order);
    } catch (error) {
      toast.error("Failed to load order details.");
      closeDetail();
    } finally {
      setDetailLoading(false);
    }
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

  // FILTERS & COUNTS LOGIC
  const countsByStatus = useMemo(() => {
    const counts = {
      ALL: orders.length,
      PENDING: 0,
      IN_PROGRESS: 0,
      READY: 0,
      SERVED: 0,
      CANCELLED: 0,
    };
    orders.forEach((o) => {
      if (counts[o.status] !== undefined) {
        counts[o.status]++;
      }
    });
    return counts;
  }, [orders]);

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

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredOrders.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredOrders, currentPage]);

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);

  const summary = useMemo(() => {
    const active = orders.filter(
      (o) => o.status !== "SERVED" && o.status !== "CANCELLED",
    ).length;
    const pending = orders.filter((o) => o.status === "PENDING").length;
    const ready = orders.filter((o) => o.status === "READY").length;
    const servedToday = orders.filter((o) => o.status === "SERVED").length; // Can be fine-tuned with date checks if needed

    return { active, pending, ready, servedToday };
  }, [orders]);

  // Dynamic colors for the active status filter tab
  const getStatusTabClass = (statusValue) => {
    const isActive = filterStatus === statusValue;
    if (!isActive) return "bg-gray-100 text-gray-500 hover:bg-gray-200";

    switch (statusValue) {
      case "ALL":
        return "bg-red-500 text-white";
      case "PENDING":
        return "bg-amber-500 text-white";
      case "IN_PROGRESS":
        return "bg-blue-500 text-white";
      case "READY":
        return "bg-emerald-500 text-white";
      case "SERVED":
        return "bg-gray-600 text-white";
      case "CANCELLED":
        return "bg-rose-600 text-white";
      default:
        return "bg-gray-900 text-white";
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] p-6 space-y-6 text-gray-800 font-sans">
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Orders Overview
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <p className="text-xs font-medium text-emerald-600">Live Updates</p>
            <span className="text-gray-300 text-xs">•</span>
            <p className="text-xs text-gray-400">
              Last updated:{" "}
              {new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </p>
          </div>
        </div>

        {/* TOP SUMMARY CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 xl:w-7/12 lg:w-8/12 w-full">
          {/* Active Card */}
          <div className="bg-white border border-gray-100 rounded-xl p-3 flex items-center justify-between shadow-sm">
            <div>
              <div className="flex items-center gap-1.5 text-gray-400 text-xs font-medium">
                <svg
                  className="w-3.5 h-3.5 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <span>Active Orders</span>
              </div>
              <p className="text-xl font-bold text-gray-900 mt-1">
                {summary.active}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">
                All ongoing orders
              </p>
            </div>
          </div>

          {/* Pending Card */}
          <div className="bg-white border border-gray-100 rounded-xl p-3 flex items-center justify-between shadow-sm">
            <div>
              <div className="flex items-center gap-1.5 text-gray-400 text-xs font-medium">
                <svg
                  className="w-3.5 h-3.5 text-amber-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Pending</span>
              </div>
              <p className="text-xl font-bold text-amber-600 mt-1">
                {summary.pending}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">
                Waiting to be prepared
              </p>
            </div>
          </div>

          {/* Ready Card */}
          <div className="bg-white border border-gray-100 rounded-xl p-3 flex items-center justify-between shadow-sm">
            <div>
              <div className="flex items-center gap-1.5 text-gray-400 text-xs font-medium">
                <svg
                  className="w-3.5 h-3.5 text-emerald-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Ready</span>
              </div>
              <p className="text-xl font-bold text-emerald-600 mt-1">
                {summary.ready}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">
                Ready for pickup
              </p>
            </div>
          </div>

          {/* Served Today Card */}
          <div className="bg-white border border-gray-100 rounded-xl p-3 flex items-center justify-between shadow-sm">
            <div>
              <div className="flex items-center gap-1.5 text-gray-400 text-xs font-medium">
                <svg
                  className="w-3.5 h-3.5 text-purple-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <span>Served </span>
              </div>
              <p className="text-xl font-bold text-gray-800 mt-1">
                {summary.servedToday}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">
                Completed orders
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FILTERS & CONTROL BAR */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-2">
        {/* Status Pills */}
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status.value}
              onClick={() => setFilterStatus(status.value)}
              className={`text-xs px-3 py-2 rounded-lg font-semibold tracking-wide transition duration-150 uppercase shadow-xs ${getStatusTabClass(status.value)}`}
            >
              {status.label}{" "}
              <span className="ml-1 opacity-80">
                ({countsByStatus[status.value] || 0})
              </span>
            </button>
          ))}
        </div>

        {/* Right Side Options Controls */}
        <div className="flex flex-wrap items-center gap-2 self-end md:self-auto">
          {/* Order Type Select Toggle Dropdown */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-xs px-3 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 font-medium outline-none focus:border-gray-400 transition cursor-pointer appearance-none pr-8 relative bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-size-[0.65rem_auto] bg-position-[right_0.75rem_center] bg-no-repeat"
          >
            <option value="ALL">Dine In / QR Order</option>
            <option value="DINE_IN">Dine In</option>
            <option value="QR">QR Order</option>
          </select>
        </div>
      </div>

      {/* ORDER CARDS CONTAINER GRID */}
      <div className="pt-2">
        <OrderList
          orders={paginatedOrders}
          onCardClick={openDetail}
          onStatusUpdate={handleStatusUpdate}
        />
      </div>

      {/* FOOTER PAGINATION BAR */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-xs font-medium text-gray-500">
        <div>
          Showing{" "}
          {filteredOrders.length === 0
            ? 0
            : (currentPage - 1) * ITEMS_PER_PAGE + 1}{" "}
          to {Math.min(currentPage * ITEMS_PER_PAGE, filteredOrders.length)} of{" "}
          {filteredOrders.length} orders
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-2 py-1.5 rounded border border-gray-200 bg-white hover:bg-gray-50 text-gray-400 disabled:opacity-50"
          >
            &lt;
          </button>
          <span className="px-3 py-1.5 rounded bg-red-500 text-white font-bold">
            {currentPage}
          </span>
          <span className="text-gray-400">of {totalPages}</span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-2 py-1.5 rounded border border-gray-200 bg-white hover:bg-gray-50 text-gray-400 disabled:opacity-50"
          >
            &gt;
          </button>
        </div>
      </div>

      {/* MODAL WINDOW OVERLAY */}
      {showDetailModal && selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={closeDetail}
          onStatusUpdate={handleStatusUpdate}
          onCancel={handleCancelOrder}
          isLoading={detailLoading}
        />
      )}
    </div>
  );
};

export default OrderPage;
