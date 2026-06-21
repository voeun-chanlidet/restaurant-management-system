// ─── Receipt View ────────────────────────────────────────────────────────────
// Shared layout used in both bill (pre-payment) and receipt (post-payment).
// When `payment` is null → bill view. When payment exists → full receipt.

import { useSettings } from "../../contexts/SettingsContext";

const ReceiptView = ({ session, orders, runningTotal, payment }) => {
  const { formatPrice } = useSettings();
  const isPaid = !!payment;

  return (
    <div
      className="rounded-xl border overflow-hidden mb-6 print-receipt"
      style={{ borderColor: "var(--color-panel-border)" }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 border-b"
        style={{ borderColor: "var(--color-panel-border)" }}
      >
        <p className="text-sm font-semibold text-heading">
          Table {session?.table?.table_number ?? "—"}
        </p>
        <p className="text-xs text-dimmed">
          {new Date(session.openedAt).toLocaleString()}
        </p>
      </div>

      {/* Orders and items */}
      {orders.map((order, index) => (
        <div
          key={order.id}
          className="px-4 py-3"
          style={{
            borderBottom: "1px solid var(--color-panel-border)",
          }}
        >
          <div className="flex justify-between items-center mb-1">
            <p className="text-sm font-medium text-heading">
              Order #{index + 1}
            </p>
            <span className="text-sm text-dimmed">
              {formatPrice(order.total)}
            </span>
          </div>
          {order.items.map((item) => (
            <div
              key={item.menuName}
              className="flex justify-between text-xs text-dimmed"
            >
              <span>
                {item.menuName} x{item.quantity}
              </span>
              <span>{formatPrice(item.subtotal)}</span>
            </div>
          ))}
        </div>
      ))}

      {/* Total */}
      <div
        className="flex justify-between items-center px-4 py-3"
        style={{
          borderTop: "1px solid var(--color-panel-border)",
          background: "var(--color-input)",
        }}
      >
        <span className="text-sm font-bold text-heading">Total</span>
        <span
          className="text-lg font-bold"
          style={{ color: "var(--color-brand)" }}
        >
          {formatPrice(runningTotal)}
        </span>
      </div>

      {/* Payment section — only shown after payment confirmed */}
      {isPaid && (
        <div
          className="px-4 py-3 space-y-1.5"
          style={{ borderTop: "1px solid var(--color-panel-border)" }}
        >
          <div className="flex justify-between text-sm">
            <span className="text-dimmed">Payment method</span>
            <span className="text-heading">{payment.method}</span>
          </div>
          {payment.method === "CASH" && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-dimmed">Cash Received</span>
                <span className="text-heading">
                  ${parseFloat(payment.cashReceived).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-dimmed">Change</span>
                <span style={{ color: "var(--color-brand)" }}>
                  ${parseFloat(payment.change).toFixed(2)}
                </span>
              </div>
            </>
          )}
          <div className="flex justify-between text-xs text-dimmed pt-1">
            <span>Processed by</span>
            <span>{payment.processor?.name ?? "—"}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceiptView;
