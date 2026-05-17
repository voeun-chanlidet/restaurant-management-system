const OrderSummary = ({ table, items, onSubmit, onBack, onCancel }) => {
  const total = items.reduce((sum, item) => sum + item.subtotal, 0);

  const handleSubmit = () => {
    onSubmit({
      tableId: table.id,
      items: items.map(({ menuId, quantity }) => ({ menuId, quantity })),
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-[var(--color-heading)]">
            Review Order
          </h2>
          <p className="text-sm text-[var(--color-dimmed)]">
            Step 3 of 3 — Table {table.table_number}
          </p>
        </div>
        <button
          onClick={onCancel}
          className="text-sm text-[var(--color-dimmed)] hover:text-[var(--color-heading)]"
        >
          ✕ Cancel
        </button>
      </div>

      {/* Items list */}
      <div className="bg-[var(--color-panel)] border border-[var(--color-panel-border)] rounded-xl overflow-hidden mb-4">
        {items.map((item, index) => (
          <div
            key={item.menuId}
            className={`flex items-center justify-between px-4 py-3 ${
              index !== items.length - 1
                ? "border-b border-[var(--color-panel-border)]"
                : ""
            }`}
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

        {/* Total row */}
        <div className="flex items-center justify-between px-4 py-3 bg-[var(--color-input)] border-t border-[var(--color-panel-border)]">
          <span className="text-[var(--color-heading)] font-bold">Total</span>
          <span className="text-[var(--color-brand)] font-bold text-lg">
            ${total.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 border border-[var(--color-panel-border)] text-[var(--color-dimmed)] hover:text-[var(--color-heading)] hover:border-[var(--color-faint)] py-2 rounded-lg text-sm font-medium transition-all"
        >
          ← Back
        </button>
        <button
          onClick={handleSubmit}
          className="flex-2 bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-black font-semibold px-8 py-2 rounded-lg text-sm transition-all"
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;
