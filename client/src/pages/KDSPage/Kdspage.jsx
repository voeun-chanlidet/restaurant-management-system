import { useState, useCallback, useEffect } from "react";
import orderService from "../../services/order";
import OrderCard from "./OrderCard";
import useKitchenSocket from "./useKitchenSocket";

const KDSPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveOrders = async () => {
      try {
        const data = await orderService.getAllOrders();
        console.log(data);
        const active = data.orders.filter((o) => o.status === "IN_PROGRESS");
        setOrders(active);
      } catch (err) {
        console.error("Failed to load orders:", err);
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
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-zinc-900/80 backdrop-blur border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white font-bold text-xl tracking-tight font-mono">
            KITCHEN DISPLAY
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-zinc-400 text-sm font-mono">
            {orders.length} active {orders.length === 1 ? "order" : "orders"}
          </span>
        </div>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-zinc-500 text-sm font-mono">
                Loading orders...
              </span>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center text-3xl">
              🍳
            </div>
            <p className="text-zinc-500 font-mono text-sm">No active orders</p>
            <p className="text-zinc-700 font-mono text-xs">
              Waiting for orders...
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
