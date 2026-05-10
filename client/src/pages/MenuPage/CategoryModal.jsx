const CategoryModal = ({
  show,
  onClose,
  onSave,
  editingCategory,
  categoryName,
  setCategoryName,
}) => {
  if (!show) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.6)" }}
    >
      <div
        className="rounded-xl p-6 w-80"
        style={{
          background: "var(--color-panel)",
          border: "1px solid var(--color-panel-border)",
        }}
      >
        <h2 className="text-base font-semibold mb-4">
          {editingCategory ? "Edit category" : "New category"}
        </h2>
        <input
          type="text"
          placeholder="Category name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className="w-full px-3 py-2 rounded-lg text-sm outline-none mb-4"
          style={{
            background: "var(--color-input)",
            color: "var(--color-heading)",
            border: "1px solid var(--color-panel-border)",
          }}
        />
        <div className="flex gap-2 justify-end">
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

export default CategoryModal;
