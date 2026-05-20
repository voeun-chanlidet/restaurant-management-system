const METHOD_STYLES = {
  CASH: "bg-[var(--color-faint)] text-[var(--color-dimmed)] border border-[var(--color-panel-border)]",
  KHQR: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
};

const PaymentHistory = ({ payments }) => {
  if (payments.length === 0) {
    return (
      <p className="text-[var(--color-dimmed)] text-sm">
        No payments recorded yet.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {payments.map((payment) => (
        <div
          key={payment.id}
          className="bg-[var(--color-panel)] border border-[var(--color-panel-border)] rounded-xl p-4"
        >
          <div className="flex items-center justify-between mb-3">
            {/* Left — table and order info */}
            <div>
              <p className="text-[var(--color-heading)] font-semibold text-sm">
                Table {payment.order.tableNumber}
              </p>
              <p className="text-[var(--color-dimmed)] text-xs mt-0.5">
                Order #{payment.order.id} · by {payment.processor.name}
              </p>
            </div>

            {/* Right — method badge + total */}
            <div className="flex flex-col items-end gap-1">
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${METHOD_STYLES[payment.method]}`}
              >
                {payment.method}
              </span>
              <span className="text-[var(--color-brand)] font-bold text-sm">
                ${parseFloat(payment.order.total).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-1 mb-3">
            {payment.order.items.map((item, index) => (
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
          </div>

          {/* Cash details */}
          {payment.method === "CASH" && (
            <div className="flex gap-4 border-t border-[var(--color-panel-border)] pt-3">
              <div>
                <p className="text-[var(--color-dimmed)] text-xs">Tendered</p>
                <p className="text-[var(--color-heading)] text-sm font-medium">
                  ${parseFloat(payment.amountTendered).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-[var(--color-dimmed)] text-xs">Change</p>
                <p className="text-green-400 text-sm font-medium">
                  ${parseFloat(payment.change).toFixed(2)}
                </p>
              </div>
            </div>
          )}

          {/* Date */}
          <p className="text-[var(--color-dimmed)] text-xs mt-3">
            {new Date(payment.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default PaymentHistory;
