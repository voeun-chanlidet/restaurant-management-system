const STATUS_STYLES = {
  PENDING: "bg-amber-50 text-amber-800 border-amber-200/60",
  IN_PROGRESS: "bg-blue-50 text-blue-800 border-blue-200/60",
  READY: "bg-green-50 text-green-800 border-green-200/60",
  SERVED: "bg-teal-50 text-teal-800 border-teal-200/60",
  CANCELLED: "bg-zinc-50 text-zinc-500 border-zinc-200/60",
};

const OrderCard = ({ order, index }) => {
  return (
    <div
      className="rounded-xl border p-5 bg-panel transition-all duration-200 hover:shadow-sm"
      style={{ borderColor: "var(--color-panel-border)" }}
    >
      {/* Order Header */}
      <div
        className="flex items-center justify-between mb-4 pb-3 border-b border-dashed"
        style={{ borderColor: "var(--color-panel-border)" }}
      >
        <div>
          <p className="text-sm font-semibold text-heading">
            Order #{index + 1}
          </p>
          <p className="text-xs text-dimmed mt-0.5">
            by {order.creator?.name || "System"}
          </p>
        </div>
        <span
          className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border tracking-wide uppercase ${
            STATUS_STYLES[order.status] || "bg-zinc-100 text-zinc-800"
          }`}
        >
          {order.status ? order.status.replace("_", " ") : "UNKNOWN"}{" "}
          {console.log(order)}
        </span>
      </div>

      {/* Item List */}
      <div className="flex flex-col gap-2">
        {order.items.map((item, i) => (
          <div key={i} className="flex justify-between text-sm items-baseline">
            <span className="text-heading font-medium">{item.menuName}</span>
            <div className="flex gap-4 text-dimmed text-xs font-mono">
              <span>x{item.quantity}</span>
              <span className="min-w-12.5 text-right">
                ${parseFloat(item.subtotal).toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Order Footer Total */}
      <div
        className="flex justify-between text-sm font-semibold text-heading mt-4 pt-3 border-t"
        style={{ borderColor: "var(--color-panel-border)" }}
      >
        <span>Order total</span>
        <span className="font-mono">${parseFloat(order.total).toFixed(2)}</span>
      </div>
    </div>
  );
};

export default OrderCard;
