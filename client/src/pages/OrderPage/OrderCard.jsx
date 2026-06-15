const STATUS_STYLES = {
  PENDING: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  IN_PROGRESS: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
  READY: "bg-green-500/20 text-green-400 border border-green-500/30",
  SERVED:
    "bg-[var(--color-faint)] text-[var(--color-dimmed)] border border-[var(--color-faint)]",
  CANCELLED: "bg-red-500/10 text-red-400 border border-red-500/20",
};

const OrderCard = ({ order, onClick }) => {
  const isCancelled = order.status === "CANCELLED";

  return (
    <div
      onClick={() => onClick(order)}
      className={`
        bg-[var(--color-panel)] border border-[var(--color-panel-border)]
        rounded-xl p-4 cursor-pointer
        hover:border-[var(--color-brand)] transition-all
        ${isCancelled ? "opacity-50" : ""}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[var(--color-heading)] font-semibold">
          {order.tableNumber}
        </span>
        <span
          className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_STYLES[order.status]}`}
        >
          {order.status.replace("_", " ")}
        </span>
      </div>

      {/* Items preview */}
      <div className="mb-3 space-y-1">
        {order.items.slice(0, 3).map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span className="text-[var(--color-dimmed)]">
              {item.quantity}x {item.menuName}
            </span>
            <span className="text-[var(--color-dimmed)]">
              ${parseFloat(item.subtotal).toLocaleString()}
            </span>
          </div>
        ))}
        {order.items.length > 3 && (
          <p className="text-xs text-[var(--color-dimmed)]">
            +{order.items.length - 3} more items
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-[var(--color-panel-border)]">
        <span className="text-xs text-[var(--color-dimmed)]">
          by {order.creator?.name || "QR"}
        </span>
        <span className="text-[var(--color-brand)] font-semibold">
          ${parseFloat(order.total).toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default OrderCard;
