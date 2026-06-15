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
    color: "text-[#9a8a70]",
    bg: "bg-[#faf8f4]",
    border: "border-[#ede8df]",
    dot: "bg-[#c8a96e]",
    pulse: false,
  },
  CANCELLED: {
    label: "Cancelled",
    description: "This order was cancelled. Please speak to a staff member.",
    color: "text-red-500",
    bg: "bg-red-50",
    border: "border-red-200",
    dot: "bg-red-400",
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
  const cfg = STATUS_CONFIG[overallStatus] || STATUS_CONFIG.PENDING;
  const allServed =
    placedOrders.length > 0 && placedOrders.every((o) => o.status === "SERVED");

  return (
    <div className="min-h-screen bg-[#faf8f4] flex flex-col">
      {/* Top bar */}
      <div className="bg-white border-b border-[#ede8df] px-4 py-4">
        <div className="max-w-xl mx-auto">
          <p className="text-xs text-[#c8a96e] font-semibold uppercase tracking-widest">
            {table ? `Table ${table.table_number}` : ""}
          </p>
          <h1
            className="text-xl font-bold text-[#2d2416] mt-0.5"
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
            <span className="relative flex h-3 w-3 flex-shrink-0">
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
              <p className="text-xs text-[#9a8a70] mt-0.5">{cfg.description}</p>
            </div>
          </div>
        </div>

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
              className="bg-white rounded-2xl border border-[#ede8df] overflow-hidden"
            >
              {/* Order header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#f5f0e8]">
                <p className="text-sm font-semibold text-[#2d2416]">
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
                      <p className="text-sm text-[#2d2416]">
                        <span className="font-medium">{item.quantity}×</span>{" "}
                        {item.name}
                      </p>
                      {item.note && (
                        <p className="text-xs text-[#9a8a70] italic mt-0.5">
                          "{item.note}"
                        </p>
                      )}
                    </div>
                    <p className="text-sm font-medium text-[#2d2416] flex-shrink-0">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Order total */}
              <div className="px-4 py-2.5 bg-[#faf8f4] border-t border-[#f0ebe2] flex justify-between">
                <span className="text-xs text-[#9a8a70]">Order total</span>
                <span className="text-sm font-bold text-[#2d2416]">
                  ${orderTotal.toFixed(2)}
                </span>
              </div>
            </div>
          );
        })}

        {/* Add more items */}
        {!allServed && (
          <button
            onClick={onAddMore}
            className="w-full border-2 border-dashed border-[#c8a96e]/40 rounded-2xl py-4 text-sm font-semibold text-[#c8a96e] flex items-center justify-center gap-2 active:bg-[#c8a96e]/5 transition-colors"
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
        )}

        {/* All served */}
        {allServed && (
          <div className="text-center py-6 space-y-2">
            <p className="text-3xl">🍽</p>
            <p className="font-semibold text-[#2d2416]">Enjoy your meal!</p>
            <p className="text-sm text-[#9a8a70]">
              Ask a staff member if you need anything else.
            </p>
          </div>
        )}

        <p className="text-xs text-center text-[#b5a898] pb-4">
          This page updates automatically — no need to refresh.
        </p>
      </div>
    </div>
  );
}
