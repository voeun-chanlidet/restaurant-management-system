import { useState, useCallback, useEffect } from "react";
import orderService from "../../services/order";
import OrderCard from "./OrderCard";
import useKitchenSocket from "../../hooks/useKitchenSocket";
import toast from "react-hot-toast";

const KDSPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveOrders = async () => {
      try {
        const data = await orderService.getAllOrders();
        const active = data.orders.filter((o) => o.status === "IN_PROGRESS");
        setOrders(active);
      } catch (err) {
        toast.error("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };
    fetchActiveOrders();
  }, []);

  const handleNewOrder = useCallback((order) => {
    setOrders((prev) => {
      const exists = prev.find((o) => o.id === order.id);
      if (exists) return prev;
      return [order, ...prev];
    });
  }, []);

  const handleOrderCancelled = useCallback((order) => {
    setOrders((prev) => prev.filter((o) => o.id !== order.id));
  }, []);

  const handleMarkReady = useCallback((orderId) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  }, []);

  useKitchenSocket({
    onNewOrder: handleNewOrder,
    onOrderCancelled: handleOrderCancelled,
    onMarkReady: handleMarkReady,
  });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* ================= HEADER ================= */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="font-bold text-xl tracking-tight">
            Kitchen Display
          </span>
        </div>

        <div className="text-sm text-gray-500">
          {orders.length} active {orders.length === 1 ? "order" : "orders"}
        </div>
      </div>

      {/* ================= BODY ================= */}
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-gray-500 text-sm">Loading orders...</span>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <div className="w-16 h-16 rounded-2xl bg-gray-200 flex items-center justify-center text-3xl">
              🍳
            </div>
            <p className="text-gray-500 text-sm">No active orders</p>
            <p className="text-gray-400 text-xs">
              Waiting for incoming orders...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onMarkReady={handleMarkReady}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default KDSPage;
