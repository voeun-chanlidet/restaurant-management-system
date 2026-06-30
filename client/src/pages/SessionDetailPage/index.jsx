import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import sessionService from "../../services/table_session";
import OrderService from "../../services/order";
import TableStats from "./TableStats";
import OrderCard from "./OrderCard";
import MenuSelector from "../OrderPage/MenuSelector";
import OrderSummary from "../OrderPage/OrderSummary";
import useSessionSocket from "../../hooks/useSessionSocket";
import toast from "react-hot-toast";
import OrderDetailModal from "../OrderPage/OrderDetailModal";

const SessionDetailPage = () => {
  const { state } = useLocation();
  const [step, setStep] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [cartData, setCartData] = useState(null);
  const navigate = useNavigate();
  const session = state?.session;

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const data = await sessionService.getSessionOrders(session.id);
      setOrders(data?.sessionOrder || []);
    } catch (err) {
      console.error("Failed to fetch session orders:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!session) {
      navigate("/dining");
      return;
    }
    fetchOrders();
  }, [session, navigate]);

  const handleAddItems = async (orderData) => {
    try {
      await OrderService.createOrder(orderData);
      setStep(null);
      setCartItems([]);
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const activeOrders = orders.filter((o) => o.status !== "CANCELLED");
  const hasUnfinishedOrders = activeOrders.some(
    (o) =>
      o.status === "PENDING" ||
      o.status === "IN_PROGRESS" ||
      o.status === "READY",
  );

  const hasNoOrders = activeOrders.length === 0;

  const orderCount = activeOrders.length;
  const itemCount = activeOrders.reduce(
    (sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0),
    0,
  );
  const runningTotal = orders.reduce(
    (sum, o) =>
      o.status === "CANCELLED" ? sum : sum + parseFloat(o.total || 0),
    0,
  );

  const openedAt = session?.openedAt
    ? new Date(session.openedAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const handleCloseEmpty = async () => {
    try {
      await sessionService.closeSession(session.id);
      toast.success("Cancelled session successfully");
      navigate("/dining");
    } catch (err) {
      navigate("/dining");
      toast.error(err.response?.data?.message || "Failed to cancel session.");
    }
  };

  // Socket
  const handleNewOrder = useCallback((order) => {
    if (order.sessionId === session.id) {
      setOrders((prev) => [...prev, order]);
    }
  }, []);

  const handleOrderUpdate = useCallback((order) => {
    if (order.sessionId === session.id) {
      setOrders((prev) => prev.map((o) => (o.id === order.id ? order : o)));
    }
  }, []);

  const handleOrderCancel = useCallback((order) => {
    setOrders((prev) => prev.map((o) => (o.id === order.id ? order : o)));
  }, []);

  useSessionSocket({
    onNewOrder: handleNewOrder,
    onOrderUpdate: handleOrderUpdate,
    onOrderCancel: handleOrderCancel,
  });

  const openDetail = async (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
    setDetailLoading(true);
    const data = await OrderService.getOrderById(order.id);
    setSelectedOrder(data.order);
    setDetailLoading(false);
  };

  const closeDetail = () => {
    setSelectedOrder(null);
    setShowDetailModal(false);
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await OrderService.updateOrderStatus(orderId, newStatus);
      toast.success("Order status updated successfully.");
      await fetchOrders();
      closeDetail();
    } catch (error) {
      toast.error(error.response?.data?.error || "Update status failed");
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await OrderService.cancelOrder(orderId);
      toast.success("Order cancelled successfully.");
      await fetchOrders();
      closeDetail();
    } catch (error) {
      toast.error(error.response?.data?.error || "Cancel order failed.");
    }
  };

  return (
    <div className="p-6 min-h-screen mx-auto dynamic-transitions bg-white max-w-full overflow-x-hidden">
      <button
        onClick={() => navigate("/dining")}
        className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors mb-6"
      >
        &larr; Floor map
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            Table {session?.table?.table_number || "T8"} &middot; Session
          </h1>
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 font-medium">
            <span className="flex items-center gap-1.5 text-emerald-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Occupied
            </span>
            <span>&middot;</span>
            <span>Opened {openedAt || "11:12 PM"}</span>
            <span>&middot;</span>
            <span>{orders.length} orders placed</span>
          </div>
        </div>

        {!step && (
          <div className="flex gap-3 items-center relative">
            {activeOrders.length === 0 && (
              <button
                onClick={handleCloseEmpty}
                className="text-sm text-red-500 hover:text-red-600 border border-red-200 hover:border-red-300 px-4 py-2 rounded-lg transition-colors font-medium"
              >
                Cancel Session
              </button>
            )}
            <button
              onClick={() => setStep("menu")}
              className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 transition-all active:scale-95 shadow-sm"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add items
            </button>

            <div className="relative group">
              <button
                disabled={hasUnfinishedOrders || hasNoOrders}
                onClick={() =>
                  navigate("/dining/payment", {
                    state: { session, orders: activeOrders, runningTotal },
                  })
                }
                className="flex items-center gap-1.5 text-sm font-semibold px-6 py-2 rounded-lg transition-all shadow-sm hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed bg-rose-500 text-white"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                Pay
              </button>
              {/* Tooltip mimicking the dark popover in the mockup */}
              {hasUnfinishedOrders && (
                <div className="absolute top-full right-0 mt-2 w-max bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  Finish all orders before paying
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Session content */}
      {!step && (
        <>
          <TableStats
            orderCount={orderCount}
            itemCount={itemCount}
            runningTotal={runningTotal}
          />

          <div className="mt-8 mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">
              Current session orders
            </h2>
            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live updates
            </div>
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
              <p className="text-xs font-medium text-gray-500">
                Loading session orders...
              </p>
            </div>
          )}

          {!loading && orderCount === 0 && (
            <div className="text-center py-16 rounded-xl border border-dashed border-gray-200">
              <p className="text-sm text-gray-500 font-medium">
                No orders yet. Add items to get started.
              </p>
            </div>
          )}

          {!loading && orders.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {orders.map((order, index) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  index={index}
                  onClick={() => openDetail(order)}
                />
              ))}
            </div>
          )}

          {/* Purple Information Banner */}
          {!loading && orders.length > 0 && (
            <div className="mt-6 flex items-center gap-2 bg-indigo-50/50 text-indigo-600 px-4 py-3 rounded-lg border border-indigo-100/50 text-sm font-medium">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Running total excludes cancelled orders
            </div>
          )}
        </>
      )}

      {/* Add items flows (unchanged) */}
      {step === "menu" && (
        <MenuSelector
          table={session.table}
          initialCart={cartData?.cart || {}}
          initialOrderNote={cartData?.orderNote || ""}
          onConfirm={(orderData) => {
            setCartData(orderData);
            setCartItems(orderData.items);
            setStep("summary");
          }}
          onCancel={() => {
            setCartData(null);
            setStep(null);
          }}
        />
      )}
      {step === "summary" && (
        <OrderSummary
          table={session.table}
          items={cartItems}
          sessionId={session.id}
          onSubmit={handleAddItems}
          onBack={() => setStep("menu")}
          onCancel={() => setStep(null)}
        />
      )}

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

export default SessionDetailPage;
