const PaymentCard = ({ order, onClick }) => {
  return (
    <div
      onClick={() => onClick(order)}
      className="bg-[var(--color-panel)] border border-[var(--color-panel-border)] rounded-xl p-4 cursor-pointer hover:brightness-110 transition"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[var(--color-heading)] font-semibold text-sm">
          Table {order.tableNumber}
        </span>
        <span className="text-xs px-2 py-1 rounded-full font-medium bg-green-500/10 text-green-400 border border-green-500/20">
          SERVED
        </span>
      </div>

      {/* Items preview */}
      <div className="mb-3 space-y-1">
        {order.items.slice(0, 3).map((item, index) => (
          <div
            key={index}
            className="flex justify-between text-xs text-[var(--color-dimmed)]"
          >
            <span>
              {item.menuName} x{item.quantity}
            </span>
            <span>${parseFloat(item.subtotal).toFixed(2)}</span>
          </div>
        ))}
        {order.items.length > 3 && (
          <p className="text-xs text-[var(--color-dimmed)]">
            +{order.items.length - 3} more items
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-[var(--color-panel-border)] pt-3">
        <span className="text-xs text-[var(--color-dimmed)]">
          by {order.creator?.name || "Customer via QR"}
        </span>
        <span className="text-sm font-semibold text-[var(--color-brand)]">
          ${parseFloat(order.total).toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export default PaymentCard;
