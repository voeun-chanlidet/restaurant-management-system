import { useAuth } from "../../contexts/AuthContext";
import { useSettings } from "../../contexts/SettingsContext";
import { SquarePen } from "lucide-react";

const MenuCard = ({ menu, onEdit, onDelete }) => {
  const { user } = useAuth();
  const { formatPrice } = useSettings();

  return (
    <div className="rounded-xl overflow-hidden border border-panel-border bg-panel shadow-sm">
      <div className="aspect-4/3 overflow-hidden bg-input">
        {menu.imageUrl ? (
          <img
            src={menu.imageUrl}
            alt={menu.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="h-full flex items-center justify-center text-xs text-dimmed">
            no image
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
            <div className="flex items-center gap-3 pr-1">
              <button
                onClick={() => onEdit(menu)}
                className="text-sm text-dimmed hover:text-heading transition-colors"
              >
                <SquarePen />
              </button>

              <button
                onClick={() => onDelete(menu.id)}
                className="text-sm text-dimmed hover:text-brand transition-colors"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
