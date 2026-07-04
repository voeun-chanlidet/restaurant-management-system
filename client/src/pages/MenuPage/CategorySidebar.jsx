import { useAuth } from "../../contexts/AuthContext";

const CategorySidebar = ({
  categories,
  menus,
  onEdit,
  onDelete,
  onAdd,
  onSelect,
  selectedCategory,
}) => {
  const { user } = useAuth();

  const getCount = (categoryId) =>
    menus.filter((m) => m.categoryId === categoryId).length;

  return (
    <div className="w-full md:w-56 shrink-0 md:border-r border-panel-border bg-panel flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-panel-border flex items-center justify-between shrink-0">
        <span className="text-xs font-semibold uppercase tracking-widest text-dimmed">
          Dishes Category
        </span>
        {user.role === "ADMIN" && (
          <button
            onClick={onAdd}
            className="text-xs font-medium px-2 py-1 rounded-md bg-brand text-white transition-colors"
          >
            + Add
          </button>
        )}
      </div>

      {/* Category list */}
      <div className="flex md:flex-col overflow-x-auto md:overflow-y-auto p-2 gap-1 scrollbar-hide">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          const count = getCount(cat.id);
          return (
            <div
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className={`group flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all whitespace-nowrap min-w-fit ${
                isActive ? "bg-brand text-white" : "text-heading hover:bg-input"
              }`}
            >
              <span className="text-sm font-medium">{cat.name}</span>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-semibold min-w-5 text-right ${isActive ? "text-white/80" : "text-dimmed"}`}
                >
                  {count}
                </span>
                {user.role === "ADMIN" && (
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(cat);
                      }}
                      className={`text-xs px-1 rounded hover:bg-black/10 ${isActive ? "text-white" : "text-dimmed"}`}
                    >
                      ✎
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(cat.id);
                      }}
                      className={`text-xs px-1 rounded hover:bg-black/10 ${isActive ? "text-white" : "text-dimmed"}`}
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategorySidebar;
