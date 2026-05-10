import MenuCard from "./MenuCard";

const MenuGrid = ({
  categories,
  selectedCategory,
  filteredMenus,
  onAdd,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
      <div
        className="p-4 border-b flex items-center justify-between shrink-0"
        style={{ borderColor: "var(--color-panel-border)" }}
      >
        <div>
          <h1 className="text-lg font-semibold">
            {categories.find((c) => c.id === selectedCategory)?.name || "Menu"}
          </h1>
          <p
            className="text-xs mt-0.5"
            style={{ color: "var(--color-dimmed)" }}
          >
            {filteredMenus.length} items
          </p>
        </div>
        <button
          onClick={onAdd}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{
            background: "var(--color-brand)",
            color: "var(--color-page)",
          }}
        >
          + Add item
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {filteredMenus.length === 0 ? (
          <div
            className="flex items-center justify-center h-40 text-sm"
            style={{ color: "var(--color-dimmed)" }}
          >
            No items in this category
          </div>
        ) : (
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredMenus.map((menu) => (
              <MenuCard
                key={menu.id}
                menu={menu}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuGrid;
