import { useSettings } from "../../contexts/SettingsContext";

export default function CartDrawer({
  open,
  cart,
  cartTotal,
  submitting,
  submitError,
  onClose,
  onUpdateQty,
  onRemove,
  onPlaceOrder,
}) {
  const { formatPrice } = useSettings();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white rounded-t-3xl shadow-2xl flex flex-col max-h-[85vh] animate-slide-up">
        {/* Header */}
        <div className="px-5 pt-4 pb-4 border-b border-[#f0ebe2] shrink-0">
          <div className="w-10 h-1 bg-[#ddd] rounded-full mx-auto mb-4" />
          <div className="flex items-center justify-between">
            <h2
              className="text-lg font-bold text-[#2d2416]"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              Your order
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#f5f0e8] flex items-center justify-center text-[#6b5c45] active:bg-[#ede8df] transition-colors"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-4 h-4"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-4">
          {cart.map((item, idx) => (
            <div
              key={`${item.menuId}-${item.note}-${idx}`}
              className="flex items-start gap-3"
            >
              {/* Qty controls */}
              <div className="flex items-center gap-2 mt-0.5">
                <button
                  onClick={() => onUpdateQty(item.menuId, item.note, -1)}
                  className="w-7 h-7 rounded-full border border-[#ede8df] flex items-center justify-center text-[#6b5c45] active:bg-[#f0ebe2] transition-colors"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className="w-3 h-3"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
                <span className="text-sm font-bold text-[#2d2416] w-4 text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() => onUpdateQty(item.menuId, item.note, 1)}
                  className="w-7 h-7 rounded-full border border-[#ede8df] flex items-center justify-center text-[#6b5c45] active:bg-[#f0ebe2] transition-colors"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className="w-3 h-3"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
              </div>

              {/* Name + note */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#2d2416]">
                  {item.name}
                </p>
                {item.note && (
                  <p className="text-xs text-[#9a8a70] mt-0.5 italic">
                    "{item.note}"
                  </p>
                )}
              </div>

              {/* Price + remove */}
              <div className="flex flex-col items-end gap-1 shrink-0">
                <p className="text-sm font-bold text-[#2d2416]">
                  {formatPrice(item.price * item.quantity)}
                </p>
                <button
                  onClick={() => onRemove(item.menuId, item.note)}
                  className="text-xs text-red-400 hover:text-red-500 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 pt-4 pb-8 border-t border-[#f0ebe2] space-y-4 shrink-0">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#6b5c45]">Total</span>
            <span className="text-xl font-bold text-[#2d2416]">
              {formatPrice(cartTotal)}
            </span>
          </div>

          {submitError && (
            <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3 text-center">
              {submitError}
            </p>
          )}

          <button
            onClick={onPlaceOrder}
            disabled={submitting || cart.length === 0}
            className="w-full bg-[#2d2416] text-white py-4 rounded-2xl font-semibold text-base active:scale-[0.98] transition-transform disabled:opacity-50"
          >
            {submitting ? "Placing order…" : "Place order"}
          </button>

          <p className="text-xs text-center text-[#9a8a70]">
            A staff member will confirm your order shortly
          </p>
        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.28s cubic-bezier(0.32, 0.72, 0, 1);
        }
      `}</style>
    </div>
  );
}
