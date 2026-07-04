import { useState, useEffect } from "react";
import MenuService from "../../services/menu";
import CategoryService from "../../services/category";
import { useSettings } from "../../contexts/SettingsContext";

const MenuSelector = ({
  table,
  onConfirm,
  onCancel,
  onBack,
  initialCart = {},
  initialOrderNote = "",
}) => {
  const { formatPrice, settings } = useSettings();

  const [categories, setCategories] = useState([]);
  const [menus, setMenus] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cart, setCart] = useState(initialCart);
  const [orderNote, setOrderNote] = useState(initialOrderNote);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catData, menuData] = await Promise.all([
          CategoryService.getAllCategories(),
          MenuService.getAllMenus(),
        ]);
        setCategories(catData.categories);
        setMenus(menuData.menus);
        setSelectedCategory(null);
      } catch (error) {
        toast.error("Failed to load menu.");
      }
    };
    fetchData();
  }, []);

  const filteredMenus = selectedCategory
    ? menus.filter((m) => m.categoryId === selectedCategory && m.isAvailable)
    : menus.filter((m) => m.isAvailable);

  const addToCart = (menu) => {
    setCart((prev) => {
      const existing = prev[menu.id];
      return {
        ...prev,
        [menu.id]: {
          menu,
          quantity: existing ? existing.quantity + 1 : 1,
          note: existing ? existing.note : "",
        },
      };
    });
  };

  const removeFromCart = (menuId) => {
    setCart((prev) => {
      const existing = prev[menuId];
      if (!existing) return prev;
      if (existing.quantity === 1) {
        const updated = { ...prev };
        delete updated[menuId];
        return updated;
      }
      return {
        ...prev,
        [menuId]: { ...existing, quantity: existing.quantity - 1 },
      };
    });
  };

  const updateItemNote = (menuId, note) => {
    setCart((prev) => ({
      ...prev,
      [menuId]: { ...prev[menuId], note },
    }));
  };

  const cartItems = Object.values(cart);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.menu.price) * item.quantity,
    0,
  );
  const taxRate = settings?.taxRate ? parseFloat(settings.taxRate) / 100 : 0;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  const handleConfirm = () => {
    const items = cartItems.map(({ menu, quantity, note }) => ({
      menuId: menu.id,
      menuName: menu.name,
      price: menu.price,
      quantity,
      note,
      subtotal: parseFloat(menu.price) * quantity,
    }));
    onConfirm({ items, orderNote, subtotal, tax, total, cart });
  };

  return (
    <div className="h-full bg-white font-sans text-gray-900 flex flex-col lg:flex-row overflow-x-hidden lg:overflow-hidden">
      {/* ── Left: menu browser ── */}
      <div className="flex-1 flex flex-col overflow-hidden p-4 sm:p-6 lg:p-8 lg:pr-4">
        <h2 className="text-lg font-bold mb-4 shrink-0">Add Items to Order</h2>

        <div className="flex flex-col lg:flex-row gap-6 flex-1 overflow-hidden min-w-0">
          {/* Category pill row (mobile) / sidebar (desktop) */}
          <div className="w-full shrink-0 lg:w-36 max-w-full overflow-hidden">
            <div
              className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto pb-2 lg:pb-0 hide-scrollbar"
              style={{
                scrollbarWidth: "none",
                WebkitOverflowScrolling: "touch",
              }}
            >
              <button
                onClick={() => setSelectedCategory(null)}
                className={`whitespace-nowrap shrink-0 lg:w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === null
                    ? "bg-red-50 text-red-600"
                    : "bg-white text-gray-500 hover:bg-gray-50"
                }`}
              >
                All
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`whitespace-nowrap shrink-0 lg:w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === cat.id
                      ? "bg-red-50 text-red-600"
                      : "bg-white text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Menu grid — this is the scroll area */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 pb-6">
              {filteredMenus.map((menu) => {
                const cartItem = cart[menu.id];
                return (
                  <div
                    key={menu.id}
                    className="border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col justify-between"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 rounded-full bg-gray-100 shrink-0 overflow-hidden">
                        {menu.imageUrl ? (
                          <img
                            src={menu.imageUrl}
                            alt={menu.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200" />
                        )}
                      </div>
                      <div className="flex-1 mt-1">
                        <h3 className="font-semibold text-gray-900 leading-tight mb-1">
                          {menu.name}
                        </h3>
                        <p className="text-red-600 font-medium">
                          {formatPrice(menu.price)}
                        </p>
                      </div>
                    </div>

                    {cartItem ? (
                      <div className="space-y-3 mt-auto">
                        <div className="flex items-center justify-between border border-pink-100 bg-pink-50/30 rounded-lg p-1">
                          <button
                            onClick={() => removeFromCart(menu.id)}
                            className="w-8 h-8 flex items-center justify-center text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          >
                            −
                          </button>
                          <span className="font-semibold w-8 text-center">
                            {cartItem.quantity}
                          </span>
                          <button
                            onClick={() => addToCart(menu)}
                            className="w-8 h-8 flex items-center justify-center text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          >
                            +
                          </button>
                        </div>
                        <input
                          type="text"
                          placeholder="Add note for this item..."
                          value={cartItem.note}
                          onChange={(e) =>
                            updateItemNote(menu.id, e.target.value)
                          }
                          className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-600 focus:outline-none focus:border-gray-300"
                        />
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(menu)}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-1 mt-auto"
                      >
                        <span>+</span> Add
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Right: order summary ── */}
      <div className="w-full lg:w-80 shrink-0 flex flex-col overflow-hidden border-t lg:border-t-0 lg:border-l border-gray-100 shadow-[0_-10px_15px_-10px_rgba(0,0,0,0.05)] lg:shadow-[-10px_0_15px_-10px_rgba(0,0,0,0.05)]">
        {/* Scrollable interior */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Current Order</h2>
            {totalItems > 0 && (
              <span className="bg-red-50 text-red-600 text-xs font-semibold px-2.5 py-1 rounded-full">
                {totalItems} items
              </span>
            )}
          </div>

          {/* Cart items — capped height, scrollable */}
          <div className="max-h-48 overflow-y-auto">
            {cartItems.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">
                No items added yet.
              </p>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.menu.id} className="flex gap-3 text-sm">
                    <span className="font-semibold text-gray-900 w-4">
                      {item.quantity}
                    </span>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {item.menu.name}
                      </p>
                      {item.note && (
                        <p className="text-gray-500 italic text-xs mt-0.5">
                          {item.note}
                        </p>
                      )}
                    </div>
                    <span className="font-medium text-gray-900">
                      {formatPrice(parseFloat(item.menu.price) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm text-gray-500 mb-2 block">
              Add Notes (Optional)
            </label>
            <textarea
              placeholder="Special requests or notes..."
              value={orderNote}
              onChange={(e) => setOrderNote(e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 resize-none h-20"
            />
          </div>

          {/* Totals */}
          <div className="space-y-2 text-sm border-t border-gray-100 pt-4">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {taxRate > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>Tax ({settings.taxRate}%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg pt-2">
              <span>Total</span>
              <span className="text-red-600">{formatPrice(total)}</span>
            </div>
          </div>
        </div>

        {/* Sticky action buttons — never scroll away */}
        <div className="shrink-0 p-4 sm:p-6 lg:p-8 pt-0 space-y-3 border-t border-gray-100">
          <button
            onClick={handleConfirm}
            disabled={totalItems === 0}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            Add Items to Order
          </button>
          <button
            onClick={onBack ?? onCancel}
            className="w-full border border-gray-200 hover:bg-gray-50 text-gray-900 font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            Review Order →
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuSelector;
