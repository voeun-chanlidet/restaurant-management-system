import { useState, useEffect } from "react";
import TableService from "../../services/table";

const STATUS_STYLES = {
  AVAILABLE: "border-green-500/40 hover:border-green-500",
  OCCUPIED: "border-red-500/40 hover:border-red-500",
  RESERVED: "border-yellow-500/40 opacity-50 cursor-not-allowed",
  MAINTENANCE: "border-faint opacity-50 cursor-not-allowed",
};

const STATUS_BADGE = {
  AVAILABLE: "bg-green-500/20 text-green-400",
  OCCUPIED: "bg-red-500/20 text-red-400",
  RESERVED: "bg-yellow-500/20 text-yellow-400",
  MAINTENANCE: "bg-[var(--color-faint)] text-[var(--color-dimmed)]",
};

const TableSelector = ({ onSelect, onCancel }) => {
  const [tables, setTables] = useState([]);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const data = await TableService.getAllTables();
        setTables(data.tables);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTables();
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-heading">Select a Table</h2>
          <p className="text-sm text-dimmed">
            Step 1 of 3 — Only available tables can be selected
          </p>
        </div>
        <button
          onClick={onCancel}
          className="text-sm text-dimmed hover:text-heading"
        >
          ✕ Cancel
        </button>
      </div>

      {/* Table grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {tables.map((table) => {
          const isSelectable =
            table.status === "AVAILABLE" || table.status === "OCCUPIED";
          return (
            <button
              key={table.id}
              disabled={!isSelectable}
              onClick={() => isSelectable && onSelect(table)}
              className={`
                bg-panel border rounded-xl p-4 text-left transition-all
                ${STATUS_STYLES[table.status]}
              `}
            >
              <p className="text-heading font-semibold mb-1">
                {table.table_number}
              </p>
              <p className="text-xs text-dimmed mb-2">
                Capacity: {table.capacity}
              </p>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${STATUS_BADGE[table.status]}`}
              >
                {table.status}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TableSelector;
