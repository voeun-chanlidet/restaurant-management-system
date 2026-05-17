import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

const STATUS_STYLES = {
  PENDING: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  IN_PROGRESS: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
  READY: "bg-green-500/20 text-green-400 border border-green-500/30",
  SERVED:
    "bg-[var(--color-faint)] text-[var(--color-dimmed)] border border-[var(--color-faint)]",
  CANCELLED: "bg-red-500/10 text-red-400 border border-red-500/20",
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

  const nextStatus = STATUS_FLOW[order.status];
  const canAdvance = nextStatus !== null;
  const canCancel =
    user.role === "ADMIN" &&
    order.status !== "SERVED" &&
    order.status !== "CANCELLED";
  const isKitchen = user.role === "KITCHEN";

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--color-panel)] border border-[var(--color-panel-border)] rounded-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--color-panel-border)]">
          <div>
            <h2 className="text-lg font-bold text-[var(--color-heading)]">
              Order #{order.id}
            </h2>
            <p className="text-sm text-[var(--color-dimmed)]">
              Table {order.tableNumber}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_STYLES[order.status]}`}
            >
              {order.status.replace("_", " ")}
            </span>
            <button
              onClick={onClose}
              className="text-[var(--color-dimmed)] hover:text-[var(--color-heading)] text-xl"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="p-5 space-y-2 max-h-64 overflow-y-auto">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-2 border-b border-[var(--color-panel-border)] last:border-0"
            >
              <div>
                <p className="text-[var(--color-heading)] text-sm font-medium">
                  {item.menuName}
                </p>
                <p className="text-[var(--color-dimmed)] text-xs">
                  ${parseFloat(item.price).toLocaleString()} × {item.quantity}
                </p>
              </div>
              <span className="text-[var(--color-brand)] font-semibold text-sm">
                ${parseFloat(item.subtotal).toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="px-5 py-3 border-t border-[var(--color-panel-border)] flex justify-between items-center">
          <span className="text-[var(--color-dimmed)] text-sm">Total</span>
          <span className="text-[var(--color-heading)] font-bold text-lg">
            ${parseFloat(order.total).toLocaleString()}
          </span>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-[var(--color-panel-border)] flex gap-3">
          {/* Cancel button — Admin only */}
          {canCancel && (
            <button
              onClick={() => onCancel(order.id)}
              className="flex-1 border border-red-500/40 text-red-400 hover:bg-red-500/10 py-2 rounded-lg text-sm font-medium transition-all"
            >
              Cancel Order
            </button>
          )}

          {/* Advance status button — not shown for Kitchen on PENDING */}
          {canAdvance && !(isKitchen && order.status === "PENDING") && (
            <button
              onClick={() => onStatusUpdate(order.id, nextStatus)}
              className="flex-1 bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-black py-2 rounded-lg text-sm font-semibold transition-all"
            >
              {STATUS_BUTTON_LABEL[order.status]}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
