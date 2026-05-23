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

  const inputClass =
    "w-full px-3 py-2 rounded-lg text-sm outline-none bg-input text-heading border border-panel-border";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="rounded-xl p-6 w-96 bg-panel border border-panel-border shadow-lg">
        <h2 className="text-base font-semibold text-heading mb-4">
          {editingMenu ? "Edit item" : "New menu item"}
        </h2>
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Name"
            value={menuForm.name}
            onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })}
            className={inputClass}
          />
          <input
            type="number"
            placeholder="Price"
            value={menuForm.price}
            onChange={(e) =>
              setMenuForm({ ...menuForm, price: e.target.value })
            }
            className={inputClass}
          />
          <select
            value={menuForm.categoryId}
            onChange={(e) =>
              setMenuForm({ ...menuForm, categoryId: e.target.value })
            }
            className={inputClass}
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
            className={inputClass}
          />
          <label className="flex items-center gap-2 text-sm text-dimmed">
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
            className="px-4 py-2 rounded-lg text-sm text-dimmed hover:text-heading transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-brand text-white hover:bg-brand-hover transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuModal;
