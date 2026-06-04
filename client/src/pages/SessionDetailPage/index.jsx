import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import sessionService from "../../services/table_session";
import OrderService from "../../services/order";
import TableStats from "./TableStats";
import OrderCard from "./OrderCard";
import MenuSelector from "../OrderPage/MenuSelector";
import OrderSummary from "../OrderPage/OrderSummary";

const SessionDetailPage = () => {
  const { state } = useLocation();
  const [step, setStep] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const session = state?.session;

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

  const orderCount = orders.length;
  const itemCount = orders.reduce(
    (sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0),
    0,
  );
  const runningTotal = orders.reduce(
    (sum, o) => sum + parseFloat(o.total || 0),
    0,
  );

  const openedAt = session?.openedAt
    ? new Date(session.openedAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div className="p-6 md:p-8 max-w-5xl w-full min-h-screen mx-auto dynamic-transitions">
      <button
        onClick={() => navigate("/dining")}
        className="flex items-center gap-1.5 text-sm font-medium text-dimmed hover:text-heading transition-colors mb-6"
      >
        ← Floor map
      </button>

      {/* Header — always visible */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-heading">
            Table {session?.table?.table_number || "N/A"} · Session
          </h1>
          <p className="text-xs text-dimmed mt-1 font-medium">
            Opened {openedAt || "Just now"} · {orderCount} order
            {orderCount !== 1 ? "s" : ""} placed
          </p>
        </div>
        {!step && (
          <div className="flex gap-3 items-center">
            <button
              onClick={() => setStep("menu")}
              className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg border transition-all hover:bg-neutral-50 active:scale-95"
              style={{
                borderColor: "var(--color-panel-border)",
                color: "var(--color-heading)",
              }}
            >
              + Add items
            </button>
            <button
              onClick={() =>
                navigate("/payment", {
                  state: { session, orders, runningTotal },
                })
              }
              className="flex items-center gap-1.5 text-sm font-semibold px-5 py-2 rounded-lg transition-all shadow-sm hover:opacity-90 active:scale-95"
              style={{ background: "var(--color-brand)", color: "#0e0e0e" }}
            >
              Pay
            </button>
          </div>
        )}
      </div>

      {/* Session content — hidden when in add items flow */}
      {!step && (
        <>
          <TableStats
            orderCount={orderCount}
            itemCount={itemCount}
            runningTotal={runningTotal}
          />

          <div className="mt-8 mb-4">
            <h2 className="text-sm font-semibold tracking-wide text-dimmed uppercase">
              Current Session Orders
            </h2>
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <div className="w-5 h-5 border-2 border-dimmed/30 border-t-dimmed rounded-full animate-spin" />
              <p className="text-xs font-medium text-dimmed">
                Loading session orders...
              </p>
            </div>
          )}

          {!loading && orderCount === 0 && (
            <div
              className="text-center py-16 rounded-xl border border-dashed"
              style={{ borderColor: "var(--color-panel-border)" }}
            >
              <p className="text-sm text-dimmed font-medium">
                No orders yet. Add items to get started.
              </p>
            </div>
          )}

          {!loading && orderCount > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {orders.map((order, index) => (
                <OrderCard key={order.id} order={order} index={index} />
              ))}
            </div>
          )}
        </>
      )}

      {/* Add items flow */}
      {step === "menu" && (
        <MenuSelector
          table={session.table}
          onConfirm={(items) => {
            setCartItems(items);
            setStep("summary");
          }}
          onCancel={() => setStep(null)}
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
    </div>
  );
};

export default SessionDetailPage;
