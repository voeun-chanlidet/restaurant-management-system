const MenuModal = ({
  show,
  editingMenu,
  menuForm,
  setMenuForm,
  onSave,
  onClose,
  categories,
}) => {
  if (!show) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.6)" }}
    >
      <div
        className="rounded-xl p-6 w-96"
        style={{
          background: "var(--color-panel)",
          border: "1px solid var(--color-panel-border)",
        }}
      >
        <h2 className="text-base font-semibold mb-4">
          {editingMenu ? "Edit item" : "New menu item"}
        </h2>
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Name"
            value={menuForm.name}
            onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })}
            className="w-full px-3 py-2 rounded-lg text-sm outline-none"
            style={{
              background: "var(--color-input)",
              color: "var(--color-heading)",
              border: "1px solid var(--color-panel-border)",
            }}
          />
          <input
            type="number"
            placeholder="Price"
            value={menuForm.price}
            onChange={(e) =>
              setMenuForm({ ...menuForm, price: e.target.value })
            }
            className="w-full px-3 py-2 rounded-lg text-sm outline-none"
            style={{
              background: "var(--color-input)",
              color: "var(--color-heading)",
              border: "1px solid var(--color-panel-border)",
            }}
          />
          <select
            value={menuForm.categoryId}
            onChange={(e) =>
              setMenuForm({ ...menuForm, categoryId: e.target.value })
            }
            className="w-full px-3 py-2 rounded-lg text-sm outline-none"
            style={{
              background: "var(--color-input)",
              color: "var(--color-heading)",
              border: "1px solid var(--color-panel-border)",
            }}
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Image URL (optional)"
            value={menuForm.imageUrl}
            onChange={(e) =>
              setMenuForm({ ...menuForm, imageUrl: e.target.value })
            }
            className="w-full px-3 py-2 rounded-lg text-sm outline-none"
            style={{
              background: "var(--color-input)",
              color: "var(--color-heading)",
              border: "1px solid var(--color-panel-border)",
            }}
          />
          <label
            className="flex items-center gap-2 text-sm"
            style={{ color: "var(--color-dimmed)" }}
          >
            <input
              type="checkbox"
              checked={menuForm.isAvailable}
              onChange={(e) =>
                setMenuForm({ ...menuForm, isAvailable: e.target.checked })
              }
            />
            Available
          </label>
        </div>
        <div className="flex gap-2 justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm"
            style={{ color: "var(--color-dimmed)" }}
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{
              background: "var(--color-brand)",
              color: "var(--color-page)",
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuModal;
