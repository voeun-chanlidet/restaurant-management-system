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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="rounded-xl p-6 w-80 bg-panel border border-panel-border shadow-lg">
        <h2 className="text-base font-semibold text-heading mb-4">
          {editingCategory ? "Edit category" : "New category"}
        </h2>
        <input
          type="text"
          placeholder="Category name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className="w-full px-3 py-2 rounded-lg text-base outline-none mb-4 bg-input text-heading border border-panel-border"
        />
        <div className="flex gap-2 justify-end">
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

export default CategoryModal;
