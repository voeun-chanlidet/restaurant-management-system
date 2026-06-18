const STATUS_STYLES = {
  PENDING: "bg-yellow-100 text-yellow-700 border border-yellow-200",
  IN_PROGRESS: "bg-blue-100 text-blue-700 border border-blue-200",
  READY: "bg-green-100 text-green-700 border border-green-200",
  SERVED: "bg-faint text-dimmed border border-faint",
  CANCELLED: "bg-red-50 text-red-400 border border-red-100",
};

const OrderCard = ({ order, onClick }) => {
  const isCancelled = order.status === "CANCELLED";
  const sourceLabel = order.creator
    ? `Staff (${order.creator.name})`
    : "QR Customer";
  const totalQty = order.items.reduce((sum, i) => sum + i.quantity, 0);

  const orderTime = new Date(order.createdAt).toLocaleString([], {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  const elapsed = (() => {
    const diff = Math.floor((Date.now() - new Date(order.createdAt)) / 1000);
    const m = Math.floor(diff / 60);
    const s = diff % 60;
    return `${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;
  })();

  return (
    <div
      onClick={() => onClick(order)}
      className={`bg-panel border border-panel-border rounded-xl p-4 cursor-pointer hover:border-brand hover:shadow-sm transition-all ${isCancelled ? "opacity-50" : ""}`}
    >
      {/* HEADER */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-heading font-semibold text-sm">
            Table {order.tableNumber || "—"}
          </p>
          <p className="text-xs text-dimmed">Session #{order.sessionId}</p>
        </div>
        <span
          className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_STYLES[order.status]}`}
        >
          {order.status.replace("_", " ")}
        </span>
      </div>

      {/* META */}
      <div className="space-y-1.5 mb-3">
        <div className="flex items-center justify-between text-xs text-dimmed">
          <span>🕐 Order time</span>
          <span className="text-heading">{orderTime}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-dimmed">
          <span>⏱ Time elapsed</span>
          <span className="text-heading">{elapsed}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-dimmed">
          <span>Source</span>
          <span className="text-heading">{sourceLabel}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-dimmed"></div>
      </div>

      {/* FOOTER */}
      <div className="flex items-center justify-between pt-3 border-t border-panel-border">
        <span className="text-xs text-dimmed">Items ({totalQty} qty)</span>
        <span className="text-brand font-bold text-sm">
          ${parseFloat(order.total).toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export default OrderCard;
