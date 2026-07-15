import { useState } from "react";
import ItemNoteModal from "./ItemNoteModal";
import { useSettings } from "../../contexts/SettingsContext";

export default function MenuView({
  table,
  categories,
  menuItems,
  cart,
  cartCount,
  cartTotal,
  onAddToCart,
  onOpenCart,
  // New props:
  hasPlacedOrders,
  onGoToStatus,
}) {
  const [activeCat, setActiveCat] = useState("all");
  const [noteModal, setNoteModal] = useState(null);
  const { formatPrice } = useSettings();

  const available = menuItems.filter((m) => m.isAvailable);
  const filtered =
    activeCat === "all"
      ? available
      : available.filter((m) => String(m.categoryId) === String(activeCat));

  function cartQtyForItem(menuId) {
    return cart
      .filter((c) => c.menuId === menuId)
      .reduce((s, c) => s + c.quantity, 0);
  }

  return (
    <div className="pb-32">
      {/* ── Sticky header + category tabs ── */}
      <div className="bg-panel border-b border-panel-border sticky top-0 z-20">
        <div className="max-w-xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              {/* Table details & Go Back Button wrapper */}
              <div className="flex items-center gap-2">
                {hasPlacedOrders && (
                  <button
                    onClick={onGoToStatus}
                    className="flex items-center gap-1 text-xs font-bold text-brand hover:text-brand-hover bg-brand/10 px-2.5 py-1 rounded-full transition-colors mr-1"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      className="w-3 h-3"
                    >
                      <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}
                <p className="text-lg text-brand font-semibold uppercase tracking-widest">
                  {table ? `Table ${table.table_number}` : ""}
                </p>
              </div>

              <h1
                className="text-xs font-bold text-heading leading-tight mt-1.5"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                What would you like?
              </h1>
            </div>
            {cartCount > 0 && (
              <button
                onClick={onOpenCart}
                className="flex items-center gap-2 bg-brand hover:bg-brand-hover text-white pl-3 pr-4 py-2.5 rounded-full text-sm font-medium shadow-lg active:scale-95 transition-all shrink-0"
              >
                <span className="w-5 h-5 rounded-full bg-white text-brand text-xs font-bold flex items-center justify-center">
                  {cartCount}
                </span>
                <span>{formatPrice(cartTotal)}</span>
              </button>
            )}
          </div>
        </div>
        {/* Category tabs */}
        <div
          className="flex justify-start gap-2 px-4 pb-3 overflow-x-auto scrollbar-none"
          style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
        >
          {[{ id: "all", name: "All" }, ...categories].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                String(activeCat) === String(cat.id)
                  ? "bg-brand text-white"
                  : "bg-input text-dimmed hover:bg-panel-border"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* ── Items ── */}
      <div className="max-w-xl mx-auto px-4 pt-5">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-dimmed text-base">
            No items in this category
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => {
              const qty = cartQtyForItem(item.id);
              return (
                <div
                  key={item.id}
                  className="bg-panel rounded-2xl border border-panel-border overflow-hidden flex items-center gap-3 pr-3 shadow-sm"
                >
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-24 h-24 object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-24 h-24 shrink-0 bg-input flex items-center justify-center">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="w-8 h-8 text-dimmed opacity-40"
                      >
                        <path d="M3 2h18M3 6h18M3 10c0 6 3 10 9 10s9-4 9-10" />
                      </svg>
                    </div>
                  )}

                  <div className="flex-1 min-w-0 py-3">
                    <p className="font-semibold text-heading text-sm leading-snug">
                      {item.name}
                    </p>
                    {item.description && (
                      <p className="text-xs text-dimmed mt-0.5 leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    <p className="text-brand font-bold text-sm mt-1.5">
                      {formatPrice(item.price)}
                    </p>
                  </div>

                  <button
                    onClick={() => setNoteModal({ item })}
                    className="relative shrink-0 w-9 h-9 rounded-full bg-brand hover:bg-brand-hover text-white flex items-center justify-center active:scale-90 transition-all shadow"
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
                    {qty > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white text-brand text-[10px] font-bold flex items-center justify-center shadow">
                        {qty}
                      </span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Floating cart bar ── */}
      {cartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-page via-page/90 to-transparent pointer-events-none">
          <div className="max-w-xl mx-auto pointer-events-auto">
            <button
              onClick={onOpenCart}
              className="w-full bg-brand hover:bg-brand-hover text-white py-4 rounded-2xl font-semibold text-base flex items-center justify-between px-5 shadow-xl active:scale-[0.98] transition-all"
            >
              <span className="bg-white text-brand text-sm font-bold w-6 h-6 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
              <span>View order</span>
              <span className="text-white font-bold">
                {formatPrice(cartTotal)}
              </span>
            </button>
          </div>
        </div>
      )}

      {noteModal && (
        <ItemNoteModal
          item={noteModal.item}
          onConfirm={(item, note, qty) => {
            onAddToCart(item, note, qty);
            setNoteModal(null);
          }}
          onClose={() => setNoteModal(null)}
        />
      )}
    </div>
  );
}
