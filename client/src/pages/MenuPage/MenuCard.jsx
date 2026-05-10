const MenuCard = ({ menu, onEdit, onDelete }) => {
  return (
    <div
      key={menu.id}
      className="rounded-xl overflow-hidden border"
      style={{
        borderColor: "var(--color-panel-border)",
        background: "var(--color-panel)",
      }}
    >
      <div
        className="h-28 flex items-center justify-center text-xs"
        style={{
          background: "var(--color-input)",
          color: "var(--color-dimmed)",
        }}
      >
        {menu.imageUrl ? (
          <img
            src={menu.imageUrl}
            alt={menu.name}
            className="w-full h-full object-cover"
          />
        ) : (
          "no image"
        )}
      </div>
      <div className="p-3">
        <p className="text-sm font-medium truncate">{menu.name}</p>
        <p className="text-xs mt-0.5" style={{ color: "var(--color-dimmed)" }}>
          ${parseFloat(menu.price).toFixed(2)}
        </p>
        <div className="flex items-center justify-between mt-2">
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{
              background: menu.isAvailable ? "#1a3a1a" : "#3a1a1a",
              color: menu.isAvailable ? "#4ade80" : "#f87171",
            }}
          >
            {menu.isAvailable ? "available" : "unavailable"}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(menu)}
              className="text-xs"
              style={{ color: "var(--color-dimmed)" }}
            >
              ✎
            </button>
            <button
              onClick={() => onDelete(menu.id)}
              className="text-xs"
              style={{ color: "var(--color-dimmed)" }}
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
