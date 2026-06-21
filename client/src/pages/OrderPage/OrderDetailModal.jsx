import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useSettings } from "../../contexts/SettingsContext";

const STATUS_STYLES = {
  PENDING: "bg-yellow-100 text-yellow-700 border border-yellow-200",
  IN_PROGRESS: "bg-blue-100 text-blue-700 border border-blue-200",
  READY: "bg-green-100 text-green-700 border border-green-200",
  SERVED: "bg-faint text-dimmed border border-faint",
  CANCELLED: "bg-red-50 text-red-400 border border-red-100",
};

const STATUS_FLOW = {
  PENDING: "IN_PROGRESS",
  IN_PROGRESS: "READY",
  READY: "SERVED",
  SERVED: null,
  CANCELLED: null,
};

const STATUS_BUTTON_LABEL = {
  PENDING: "Mark In Progress",
  IN_PROGRESS: "Mark Ready",
  READY: "Mark Served",
};

const OrderDetailModal = ({ order, onClose, onStatusUpdate, onCancel }) => {
  const { user } = useContext(AuthContext);
  const { formatPrice } = useSettings();

  const nextStatus = STATUS_FLOW[order.status];
  const isAdmin = user.role === "ADMIN";
  const isStaff = user.role === "STAFF";
  const isKitchen = user.role === "KITCHEN";

  const canAdvance =
    nextStatus !== null && !(isKitchen && order.status === "PENDING");

  const canCancel = (isAdmin || isStaff) && order.status === "PENDING";

  const sourceLabel = order.creator
    ? `Staff (${order.creator.name})`
    : "QR Customer";

  const orderTime = new Date(order.createdAt).toLocaleString([], {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "short",
  });

  const totalQty = order.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-panel border border-panel-border rounded-2xl w-full max-w-md shadow-lg">
        {/* HEADER */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-panel-border">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-heading">
              Order #{order.id}
            </h2>
            <span
              className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_STYLES[order.status]}`}
            >
              {order.status.replace("_", " ")}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-dimmed hover:text-heading text-lg"
          >
            ✕
          </button>
        </div>

        {/* META */}
        <div className="px-5 py-3 border-b border-panel-border grid grid-cols-2 gap-y-2 text-xs">
          <span className="text-dimmed">Table</span>
          <span className="text-heading font-medium text-right">
            Table {order.tableNumber || "—"}
          </span>

          <span className="text-dimmed">Session</span>
          <span className="text-heading font-medium text-right">
            #{order.sessionId || "—"}
          </span>

          <span className="text-dimmed">Source</span>
          <span className="text-heading font-medium text-right">
            {sourceLabel}
          </span>

          <span className="text-dimmed">Type</span>
          <span className="text-heading font-medium text-right">
            {order.orderType}
          </span>

          <span className="text-dimmed">Time</span>
          <span className="text-heading font-medium text-right">
            {orderTime}
          </span>
        </div>

        {/* ITEMS */}
        <div className="px-5 py-3 space-y-3 max-h-56 overflow-y-auto">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between gap-2 border-b border-panel-border pb-2 last:border-0 last:pb-0"
            >
              <div>
                <p className="text-heading text-sm font-medium">
                  {item.menuName}
                </p>
                <p className="text-dimmed text-xs">
                  {formatPrice(item.price)} × {item.quantity}
                </p>
                {item.note && (
                  <p className="text-xs text-yellow-600 mt-0.5">
                    Note: {item.note}
                  </p>
                )}
              </div>
              <span className="text-brand font-semibold text-sm shrink-0">
                {formatPrice(item.subtotal)}
              </span>
            </div>
          ))}
        </div>

        {/* SUMMARY */}
        <div className="px-5 py-3 border-t border-panel-border space-y-1.5 text-xs">
          <div className="flex justify-between text-dimmed">
            <span>Qty</span>
            <span>{totalQty} items</span>
          </div>
          <div className="flex justify-between font-bold text-sm">
            <span className="text-heading">Total</span>
            <span className="text-heading">{formatPrice(order.total)}</span>
          </div>
        </div>

        {/* ACTIONS */}
        {(canCancel || canAdvance) && (
          <div className="px-5 py-4 border-t border-panel-border flex gap-3">
            {canCancel && (
              <button
                onClick={() => onCancel(order.id)}
                className="flex-1 border border-red-200 text-red-500 hover:bg-red-50 py-2.5 rounded-xl text-sm font-medium transition-all"
              >
                Cancel Order
              </button>
            )}
            {canAdvance && (
              <button
                onClick={() => onStatusUpdate(order.id, nextStatus)}
                className="flex-1 bg-brand hover:bg-brand-hover text-white py-2.5 rounded-xl text-sm font-semibold transition-all"
              >
                {STATUS_BUTTON_LABEL[order.status]}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailModal;
