import { useAuth } from "../../contexts/AuthContext";

const STATUS_STYLES = {
  AVAILABLE: {
    border: "border-green-500",
    text: "text-green-600",
    badge: "bg-green-100 text-green-700",
    label: "Available",
  },
  OCCUPIED: {
    border: "border-orange-500",
    text: "text-orange-600",
    badge: "bg-orange-100 text-orange-700",
    label: "Occupied",
  },
  RESERVED: {
    border: "border-amber-500",
    text: "text-amber-600",
    badge: "bg-amber-100 text-amber-700",
    label: "Reserved",
  },
  MAINTENANCE: {
    border: "border-zinc-400",
    text: "text-zinc-500",
    badge: "bg-zinc-100 text-zinc-600",
    label: "Maintenance",
  },
};

const TableCard = ({ table, onEdit, onTableClick }) => {
  const style = STATUS_STYLES[table.status] || STATUS_STYLES.AVAILABLE;
  const isRound = table.shape === "round";
  const { user } = useAuth();

  return (
    <div
      onClick={() => onTableClick(table)}
      className="flex flex-col items-center gap-2 p-4 rounded-xl border cursor-pointer hover:border-brand transition-colors bg-panel"
      style={{ borderColor: "var(--color-panel-border)" }}
    >
      <div
        className={`flex items-center justify-center border-2 font-semibold text-sm ${style.border} ${style.text} ${isRound ? "rounded-full w-14 h-14" : "rounded-md w-16 h-11"}`}
      >
        {table.table_number}
      </div>

      <p className="text-sm font-medium text-heading">{table.table_number}</p>

      <p className="text-xs text-dimmed">{table.capacity} seats</p>

      <span
        className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${style.badge}`}
      >
        {style.label}
      </span>
      {user.role === "ADMIN" && onEdit && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(table);
          }}
          className="text-xs text-dimmed hover:text-brand"
        >
          ✏️
        </button>
      )}
    </div>
  );
};

export default TableCard;
