import { useState } from "react";

const PaymentModal = ({ order, onClose, onSubmit }) => {
  const [method, setMethod] = useState("CASH");
  const [amountTendered, setAmountTendered] = useState("");

  const total = parseFloat(order.total);
  const tendered = parseFloat(amountTendered) || 0;
  const change = method === "CASH" ? tendered - total : null;
  const isInsufficient =
    method === "CASH" && tendered < total && amountTendered !== "";
  const canSubmit =
    method === "KHQR" || (method === "CASH" && tendered >= total);

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({
      orderId: order.id,
      method,
      amountTendered: method === "CASH" ? tendered : null,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--color-panel)] border border-[var(--color-panel-border)] rounded-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--color-panel-border)]">
          <div>
            <h2 className="text-[var(--color-heading)] font-bold text-lg">
              Process Payment
            </h2>
            <p className="text-[var(--color-dimmed)] text-xs mt-0.5">
              Table {order.tableNumber} · Order #{order.id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--color-dimmed)] hover:text-[var(--color-heading)] text-xl"
          >
            ✕
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Items summary */}
          <div className="space-y-2">
            <p className="text-[var(--color-dimmed)] text-xs uppercase tracking-wider">
              Items
            </p>
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-[var(--color-heading)]">
                  {item.menuName}
                  <span className="text-[var(--color-dimmed)] ml-1">
                    x{item.quantity}
                  </span>
                </span>
                <span className="text-[var(--color-dimmed)]">
                  ${parseFloat(item.subtotal).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="flex justify-between items-center border-t border-[var(--color-panel-border)] pt-4">
            <span className="text-[var(--color-dimmed)] text-sm">Total</span>
            <span className="text-[var(--color-brand)] font-bold text-xl">
              ${total.toFixed(2)}
            </span>
          </div>

          {/* Payment method */}
          <div>
            <p className="text-[var(--color-dimmed)] text-xs uppercase tracking-wider mb-2">
              Payment Method
            </p>
            <div className="flex gap-3">
              {["CASH", "KHQR"].map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setMethod(m);
                    setAmountTendered("");
                  }}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition ${
                    method === m
                      ? "bg-[var(--color-brand)] text-black border-[var(--color-brand)]"
                      : "bg-[var(--color-input)] text-[var(--color-dimmed)] border-[var(--color-panel-border)] hover:text-[var(--color-heading)]"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Cash input */}
          {method === "CASH" && (
            <div>
              <p className="text-[var(--color-dimmed)] text-xs uppercase tracking-wider mb-2">
                Amount Tendered
              </p>
              <input
                type="number"
                value={amountTendered}
                onChange={(e) => setAmountTendered(e.target.value)}
                placeholder={`Min $${total.toFixed(2)}`}
                className={`w-full bg-[var(--color-input)] border rounded-lg px-4 py-2.5 text-[var(--color-heading)] text-sm outline-none transition ${
                  isInsufficient
                    ? "border-red-500/50 focus:border-red-500"
                    : "border-[var(--color-panel-border)] focus:border-[var(--color-brand)]"
                }`}
              />
              {isInsufficient && (
                <p className="text-red-400 text-xs mt-1">Insufficient amount</p>
              )}

              {/* Change display */}
              {tendered >= total && amountTendered !== "" && (
                <div className="flex justify-between items-center mt-3 bg-[var(--color-input)] border border-[var(--color-panel-border)] rounded-lg px-4 py-3">
                  <span className="text-[var(--color-dimmed)] text-sm">
                    Change
                  </span>
                  <span className="text-green-400 font-bold text-lg">
                    ${change.toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* KHQR message */}
          {method === "KHQR" && (
            <div className="bg-[var(--color-input)] border border-[var(--color-panel-border)] rounded-lg px-4 py-3 text-center">
              <p className="text-[var(--color-dimmed)] text-sm">
                Customer scans and pays exact amount via KHQR
              </p>
            </div>
          )}

          {/* Confirm button */}
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] disabled:opacity-40 disabled:cursor-not-allowed text-black font-semibold py-2.5 rounded-lg text-sm"
          >
            Confirm Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
