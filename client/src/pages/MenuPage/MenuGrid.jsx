import { useAuth } from "../../contexts/AuthContext";
import MenuCard from "./MenuCard";

const MenuGrid = ({
  categories,
  selectedCategory,
  filteredMenus,
  onAdd,
  onEdit,
  onDelete,
}) => {
  const { user } = useAuth();

  return (
    <div className="flex-1 min-w-0 flex flex-col overflow-hidden bg-page">
      {/* Header */}
      <div className="px-5 py-4 border-b border-panel-border flex items-center justify-between shrink-0 bg-panel">
        <div>
          <h1 className="text-lg font-semibold text-heading">
            {categories.find((c) => c.id === selectedCategory)?.name || "Menu"}
          </h1>
          <p className="text-xs mt-0.5 text-dimmed">
            {filteredMenus.length} items
          </p>
        </div>
        {user.role === "ADMIN" && (
          <button
            onClick={onAdd}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-brand text-white transition-colors hover:bg-brand-hover"
          >
            + Add New Dishes
          </button>
        )}
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-5">
        {filteredMenus.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-sm text-dimmed">
            No items in this category
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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
