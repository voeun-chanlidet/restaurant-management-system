import { useState, useEffect, useRef } from "react";
import { useSettings } from "../../contexts/SettingsContext";

export default function ItemNoteModal({ item, onConfirm, onClose }) {
  const [note, setNote] = useState("");
  const [qty, setQty] = useState(1);
  const inputRef = useRef(null);
  const { formatPrice } = useSettings();

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 150);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative w-full max-w-md bg-panel rounded-t-3xl sm:rounded-3xl shadow-2xl px-5 pt-5 pb-8 animate-slide-up">
        {/* Drag handle */}
        <div className="w-10 h-1 bg-faint rounded-full mx-auto mb-5 sm:hidden" />

        {/* Item */}
        <div className="flex items-center gap-3 mb-5">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-14 h-14 rounded-xl object-cover shrink-0"
            />
          ) : (
            <div className="w-14 h-14 rounded-xl bg-input flex items-center justify-center shrink-0">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="w-6 h-6 text-dimmed opacity-50"
              >
                <path d="M3 2h18M3 6h18M3 10c0 6 3 10 9 10s9-4 9-10" />
              </svg>
            </div>
          )}
          <div>
            <p className="font-semibold text-heading text-base">{item.name}</p>
            <p className="text-brand font-bold text-sm mt-0.5">
              {formatPrice(parseFloat(item.price))}
            </p>
          </div>
        </div>

        {/* Quantity */}
        <div className="flex items-center justify-between mb-5">
          <span className="text-sm font-medium text-dimmed">Quantity</span>
          <div className="flex items-center gap-4">
            {/* - */}
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="w-9 h-9 rounded-full border border-panel-border text-heading flex items-center justify-center active:bg-input transition-colors"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="w-4 h-4"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
            <span className="text-lg font-bold text-heading w-5 text-center">
              {qty}
            </span>
            {/* + */}
            <button
              onClick={() => setQty((q) => q + 1)}
              className="w-9 h-9 rounded-full border border-panel-border text-heading flex items-center justify-center active:bg-input transition-colors"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="w-4 h-4"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Note */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-dimmed mb-1.5">
            Special request{" "}
            <span className="text-faint font-normal">(optional)</span>
          </label>
          <textarea
            ref={inputRef}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. No onions, extra spicy, less sauce…"
            rows={2}
            maxLength={120}
            className="w-full bg-input border border-panel-border rounded-xl px-4 py-3 text-base text-heading placeholder:text-dimmed resize-none focus:outline-none focus:border-brand transition-colors"
          />
          <p className="text-xs text-dimmed text-right mt-1">
            {note.length}/120
          </p>
        </div>

        {/* Confirm */}
        <button
          onClick={() => onConfirm(item, note.trim(), qty)}
          className="w-full bg-brand hover:bg-brand-hover text-white py-4 rounded-2xl font-semibold text-base flex items-center justify-between px-5 active:scale-[0.98] transition-all"
        >
          <span>Add to order</span>
          <span className="text-white font-bold">
            {formatPrice(parseFloat(item.price) * qty)}
          </span>
        </button>
      </div>

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        .animate-slide-up {
          animation: slide-up 0.25s cubic-bezier(0.32, 0.72, 0, 1);
        }
      `}</style>
    </div>
  );
}
