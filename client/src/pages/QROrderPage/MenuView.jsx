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
      <div className="bg-white border-b border-[#ede8df] sticky top-0 z-20">
        <div className="max-w-xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#c8a96e] font-semibold uppercase tracking-widest">
                {table ? `Table ${table.table_number}` : ""}
              </p>
              <h1
                className="text-xl font-bold text-[#2d2416] leading-tight mt-0.5"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                What would you like?
              </h1>
            </div>
            {cartCount > 0 && (
              <button
                onClick={onOpenCart}
                className="flex items-center gap-2 bg-[#2d2416] text-white pl-3 pr-4 py-2.5 rounded-full text-sm font-medium shadow-lg active:scale-95 transition-transform"
              >
                <span className="w-5 h-5 rounded-full bg-[#c8a96e] text-[#2d2416] text-xs font-bold flex items-center justify-center">
                  {cartCount}
                </span>
                <span>{formatPrice(cartTotal)}</span>
              </button>
            )}
          </div>
        </div>

        {/* Category tabs */}
        <div
          className="flex justify-center gap-2 px-4 pb-3 overflow-x-auto"
          style={{ scrollbarWidth: "none" }}
        >
          {[{ id: "all", name: "All" }, ...categories].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                String(activeCat) === String(cat.id)
                  ? "bg-[#2d2416] text-white"
                  : "bg-[#f0ebe2] text-[#6b5c45] hover:bg-[#e8e0d4]"
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
          <div className="text-center py-16 text-[#9a8a70] text-base">
            No items in this category
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => {
              const qty = cartQtyForItem(item.id);
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-[#ede8df] overflow-hidden flex items-center gap-3 pr-3 shadow-sm"
                >
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-24 h-24 object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-24 h-24 shrink-0 bg-[#f5f0e8] flex items-center justify-center">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#c8a96e"
                        strokeWidth="1.5"
                        className="w-8 h-8 opacity-40"
                      >
                        <path d="M3 2h18M3 6h18M3 10c0 6 3 10 9 10s9-4 9-10" />
                      </svg>
                    </div>
                  )}

                  <div className="flex-1 min-w-0 py-3">
                    <p className="font-semibold text-[#2d2416] text-sm leading-snug">
                      {item.name}
                    </p>
                    {item.description && (
                      <p className="text-xs text-[#9a8a70] mt-0.5 leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    <p className="text-[#c8a96e] font-bold text-sm mt-1.5">
                      {formatPrice(item.price)}
                    </p>
                  </div>

                  <button
                    onClick={() => setNoteModal({ item })}
                    className="relative shrink-0 w-9 h-9 rounded-full bg-[#2d2416] text-white flex items-center justify-center active:scale-90 transition-transform shadow"
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
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#c8a96e] text-[#2d2416] text-[10px] font-bold flex items-center justify-center">
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
        <div className="fixed bottom-0 left-0 right-0 z-20 p-4 bg-linear-to-t from-[#faf8f4] via-[#faf8f4]/90 to-transparent pointer-events-none">
          <div className="max-w-xl mx-auto pointer-events-auto">
            <button
              onClick={onOpenCart}
              className="w-full bg-[#2d2416] text-white py-4 rounded-2xl font-semibold text-base flex items-center justify-between px-5 shadow-xl active:scale-[0.98] transition-transform"
            >
              <span className="bg-[#c8a96e] text-[#2d2416] text-sm font-bold w-6 h-6 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
              <span>View order</span>
              <span className="text-[#c8a96e] font-bold">
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
