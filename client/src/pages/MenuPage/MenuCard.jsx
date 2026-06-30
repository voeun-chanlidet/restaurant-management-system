import { useAuth } from "../../contexts/AuthContext";
import { useSettings } from "../../contexts/SettingsContext";
import { SquarePen, Trash2, Image as ImageIcon } from "lucide-react"; // Imported ImageIcon for placeholder

const MenuCard = ({ menu, onEdit, onDelete }) => {
  const { user } = useAuth();
  const { formatPrice } = useSettings();

  return (
    // 1. Added "group" to parent to handle inner hover styles, plus a subtle shadow shift
    <div className="group rounded-xl overflow-hidden border border-panel-border bg-panel shadow-sm hover:shadow-md transition-all duration-200">
      <div className="aspect-4/3 overflow-hidden bg-input relative">
        {menu.imageUrl ? (
          <img
            src={menu.imageUrl}
            alt={menu.name}
            // 2. Added group-hover:scale-105 for smooth zoom.
            // 3. Added a conditional opacity/grayscale check for unavailable items.
            className={`w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 ${
              !menu.isAvailable ? "opacity-50 grayscale-40" : ""
            }`}
          />
        ) : (
          // 4. Upgraded the fallback UI with a clean layout and icon
          <div className="h-full flex flex-col items-center justify-center gap-1.5 text-dimmed/60 bg-input/40">
            <ImageIcon size={22} strokeWidth={1.5} />
            <span className="text-xs font-medium">No image</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <p className="text-base font-semibold text-heading truncate">
          {menu.name}
        </p>

        <p className="text-sm mt-1 text-dimmed">{formatPrice(menu.price)}</p>

        <div className="flex items-center justify-between mt-4">
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-medium ${
              menu.isAvailable
                ? "bg-success-bg text-success-text"
                : "bg-danger-bg text-danger-text"
            }`}
          >
            {menu.isAvailable ? "available" : "unavailable"}
          </span>

          {user.role === "ADMIN" && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onEdit(menu)}
                className="p-1.5 text-dimmed hover:text-heading hover:bg-input rounded-md transition-colors"
                title="Edit item"
              >
                <SquarePen size={18} />
              </button>

              <button
                onClick={() => onDelete(menu.id)}
                className="p-1.5 text-dimmed hover:text-danger-text hover:bg-danger-bg rounded-md transition-colors"
                title="Delete item"
              >
                <Trash2 size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
