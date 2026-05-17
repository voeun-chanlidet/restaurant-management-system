import { useState, useEffect } from "react";
import MenuService from "../../services/menu";
import CategoryService from "../../services/category";

const MenuSelector = ({ table, onConfirm, onCancel }) => {
  const [categories, setCategories] = useState([]);
  const [menus, setMenus] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cart, setCart] = useState({}); // { menuId: { menu, quantity } }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catData, menuData] = await Promise.all([
          CategoryService.getAllCategories(),
          MenuService.getAllMenus(),
        ]);
        setCategories(catData.categories);
        setMenus(menuData.menus);
        setSelectedCategory(catData.categories[0]?.id ?? null);
      } catch (error) {
        console.error(error);
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

  const totalItems = Object.values(cart).reduce(
    (sum, i) => sum + i.quantity,
    0,
  );

  const handleConfirm = () => {
    const items = Object.values(cart).map(({ menu, quantity }) => ({
      menuId: menu.id,
      menuName: menu.name,
      price: menu.price,
      quantity,
      subtotal: parseFloat(menu.price) * quantity,
    }));
    onConfirm(items);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-[var(--color-heading)]">
            Select Items
          </h2>
          <p className="text-sm text-[var(--color-dimmed)]">
            Step 2 of 3 — Table {table.table_number}
          </p>
        </div>
        <button
          onClick={onCancel}
          className="text-sm text-[var(--color-dimmed)] hover:text-[var(--color-heading)]"
        >
          ✕ Cancel
        </button>
      </div>

      <div className="flex gap-4">
        {/* Category sidebar */}
        <div className="w-36 shrink-0 space-y-1">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
              selectedCategory === null
                ? "bg-[var(--color-brand)] text-black font-semibold"
                : "text-[var(--color-dimmed)] hover:text-[var(--color-heading)]"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                selectedCategory === cat.id
                  ? "bg-[var(--color-brand)] text-black font-semibold"
                  : "text-[var(--color-dimmed)] hover:text-[var(--color-heading)]"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Menu grid */}
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-1">
          {filteredMenus.map((menu) => {
            const cartItem = cart[menu.id];
            return (
              <div
                key={menu.id}
                className="bg-[var(--color-panel)] border border-[var(--color-panel-border)] rounded-xl p-3"
              >
                <p className="text-[var(--color-heading)] text-sm font-medium mb-1">
                  {menu.name}
                </p>
                <p className="text-[var(--color-brand)] text-sm font-semibold mb-3">
                  ${parseFloat(menu.price).toLocaleString()}
                </p>

                {/* Quantity controls */}
                {cartItem ? (
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => removeFromCart(menu.id)}
                      className="w-7 h-7 rounded-full bg-[var(--color-input)] text-[var(--color-heading)] hover:bg-[var(--color-faint)] transition-all"
                    >
                      −
                    </button>
                    <span className="text-[var(--color-heading)] font-semibold">
                      {cartItem.quantity}
                    </span>
                    <button
                      onClick={() => addToCart(menu)}
                      className="w-7 h-7 rounded-full bg-[var(--color-brand)] text-black hover:bg-[var(--color-brand-hover)] transition-all"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => addToCart(menu)}
                    className="w-full text-xs bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-black font-semibold py-1.5 rounded-lg transition-all"
                  >
                    Add
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      {totalItems > 0 && (
        <div className="mt-4 flex items-center justify-between pt-4 border-t border-[var(--color-panel-border)]">
          <p className="text-[var(--color-dimmed)] text-sm">
            {totalItems} item{totalItems > 1 ? "s" : ""} selected
          </p>
          <button
            onClick={handleConfirm}
            className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-black font-semibold px-5 py-2 rounded-lg text-sm"
          >
            Review Order →
          </button>
        </div>
      )}
    </div>
  );
};

export default MenuSelector;
