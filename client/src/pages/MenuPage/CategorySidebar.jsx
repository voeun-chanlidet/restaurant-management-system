const CategorySidebar = ({
  categories,
  onEdit,
  onDelete,
  onAdd,
  onSelect,
  selectedCategory,
}) => {
  return (
    <div
      className="w-full md:w-48 shrink-0 border-r md:flex flex-col"
      style={{
        borderColor: "var(--color-panel-border)",
        background: "var(--color-panel)",
      }}
    >
      <div
        className="p-3 border-b flex items-center justify-between"
        style={{ borderColor: "var(--color-panel-border)" }}
      >
        <span
          className="text-xs uppercase tracking-wider"
          style={{ color: "var(--color-dimmed)" }}
        >
          Categories
        </span>
        <button
          onClick={onAdd}
          className="text-lg leading-none"
          style={{ color: "var(--color-brand)" }}
        >
          +
        </button>
      </div>
      <div className="flex md:flex-col overflow-x-auto md:overflow-y-auto p-2 gap-2 scrollbar-hide">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors whitespace-nowrap min-w-fit"
            style={{
              background:
                selectedCategory === cat.id
                  ? "var(--color-panel-border)"
                  : "transparent",
              color:
                selectedCategory === cat.id
                  ? "var(--color-heading)"
                  : "var(--color-dimmed)",
            }}
            onClick={() => onSelect(cat.id)}
          >
            <span className="text-sm truncate">{cat.name}</span>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(cat);
                }}
                className="text-xs px-1"
                style={{ color: "var(--color-dimmed)" }}
              >
                ✎
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(cat.id);
                }}
                className="text-xs px-1"
                style={{ color: "var(--color-dimmed)" }}
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySidebar;
