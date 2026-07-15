import { useSettings } from "../../contexts/SettingsContext";

const STATUS_CONFIG = {
  PENDING: {
    label: "Waiting",
    description: "Your order is waiting to be confirmed",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    dot: "bg-amber-400",
    pulse: true,
  },
  PENDING_APPROVAL: {
    label: "Pending approval",
    description: "Waiting for staff to review your order",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    dot: "bg-amber-400",
    pulse: true,
  },
  IN_PROGRESS: {
    label: "Being prepared",
    description: "The kitchen is working on your food",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    dot: "bg-blue-400",
    pulse: true,
  },
  READY: {
    label: "Ready!",
    description: "Your food is ready — a staff member will bring it over",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    dot: "bg-emerald-400",
    pulse: false,
  },
  SERVED: {
    label: "Served",
    description: "Enjoy your meal!",
    color: "text-dimmed",
    bg: "bg-input",
    border: "border-panel-border",
    dot: "bg-faint",
    pulse: false,
  },
  CANCELLED: {
    label: "Cancelled",
    description: "This order was cancelled. Please speak to a staff member.",
    color: "text-danger-text",
    bg: "bg-danger-bg",
    border: "border-danger-bg", // clean custom matching bg
    dot: "bg-danger-text",
    pulse: false,
  },
};

function getOverallStatus(orders) {
  if (!orders.length) return "PENDING";
  const priority = [
    "IN_PROGRESS",
    "PENDING_APPROVAL",
    "PENDING",
    "READY",
    "SERVED",
    "CANCELLED",
  ];
  for (const s of priority) {
    if (orders.some((o) => o.status === s)) return s;
  }
  return orders[0].status;
}

export default function OrderStatusView({ table, placedOrders, onAddMore }) {
  const overallStatus = getOverallStatus(placedOrders);
  const { formatPrice } = useSettings();
  const cfg = STATUS_CONFIG[overallStatus] || STATUS_CONFIG.PENDING;
  const hasCancelled = placedOrders.some((o) => o.status === "CANCELLED");
  const allServed =
    placedOrders.length > 0 && placedOrders.every((o) => o.status === "SERVED");

  return (
    <div className="min-h-screen bg-page flex flex-col">
      {/* Top bar */}
      <div className="bg-panel border-b border-panel-border px-4 py-4">
        <div className="max-w-xl mx-auto">
          <p className="text-xs text-brand font-semibold uppercase tracking-widest">
            {table ? `Table ${table.table_number}` : ""}
          </p>
          <h1
            className="text-xl font-bold text-heading mt-0.5"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Order status
          </h1>
        </div>
      </div>

      <div className="flex-1 max-w-xl mx-auto w-full px-4 py-6 space-y-4">
        {/* Overall status banner */}
        <div className={`rounded-2xl border ${cfg.border} ${cfg.bg} px-5 py-4`}>
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3 shrink-0">
              {cfg.pulse && (
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full ${cfg.dot} opacity-60`}
                />
              )}
              <span
                className={`relative inline-flex rounded-full h-3 w-3 ${cfg.dot}`}
              />
            </span>
            <div>
              <p className={`font-bold text-base ${cfg.color}`}>{cfg.label}</p>
              <p className="text-xs text-dimmed mt-0.5">{cfg.description}</p>
            </div>
          </div>
        </div>

        {/* Cancellation warning banner */}
        {hasCancelled && (
          <div className="rounded-xl border border-danger-bg bg-danger-bg px-4 py-2.5 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-danger-text shrink-0" />
            <p className="text-xs text-danger-text font-medium">
              One of your orders was cancelled
            </p>
          </div>
        )}

        {/* Individual orders */}
        {placedOrders.map((order, idx) => {
          const orderCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
          const orderTotal = (order.items || []).reduce(
            (s, i) => s + i.price * i.quantity,
            0,
          );
          return (
            <div
              key={order.id}
              className="bg-panel rounded-2xl border border-panel-border overflow-hidden"
            >
              {/* Order header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-panel-border">
                <p className="text-sm font-semibold text-heading">
                  Order {idx + 1}
                </p>
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${orderCfg.bg} ${orderCfg.color} border ${orderCfg.border}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${orderCfg.dot}`}
                  />
                  {orderCfg.label}
                </span>
              </div>

              {/* Items */}
              <div className="px-4 py-3 space-y-2">
                {(order.items || []).map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start justify-between gap-2"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-heading">
                        <span className="font-medium">{item.quantity}×</span>{" "}
                        {item.name}
                      </p>
                      {item.note && (
                        <p className="text-xs text-dimmed italic mt-0.5">
                          "{item.note}"
                        </p>
                      )}
                    </div>
                    <p className="text-sm font-medium text-heading shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Order total */}
              <div className="px-4 py-2.5 bg-input border-t border-panel-border flex justify-between">
                <span className="text-xs text-dimmed">Order total</span>
                <span className="text-sm font-bold text-heading">
                  {formatPrice(orderTotal)}
                </span>
              </div>
            </div>
          );
        })}

        {/* Add more button */}
        <button
          onClick={onAddMore}
          className="w-full border-2 border-dashed border-brand/40 rounded-2xl py-4 text-sm font-semibold text-brand flex items-center justify-center gap-2 active:bg-brand/5 transition-all"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className="w-4 h-4"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add more items
        </button>

        {/* All served */}
        {allServed && (
          <div className="text-center py-6 space-y-2">
            <p className="text-3xl">🍽</p>
            <p className="font-semibold text-heading">Enjoy your meal!</p>
            <p className="text-sm text-dimmed">
              Ask a staff member if you need anything else.
            </p>
          </div>
        )}

        <p className="text-xs text-center text-dimmed pb-4">
          This page updates automatically — no need to refresh.
        </p>
      </div>
    </div>
  );
}
