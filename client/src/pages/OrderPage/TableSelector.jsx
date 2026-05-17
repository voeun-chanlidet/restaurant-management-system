import { useState, useEffect } from "react";
import TableService from "../../services/table";

const STATUS_STYLES = {
  AVAILABLE: "border-green-500/40 hover:border-green-500",
  OCCUPIED: "border-red-500/40 opacity-50 cursor-not-allowed",
  RESERVED: "border-yellow-500/40 opacity-50 cursor-not-allowed",
  MAINTENANCE: "border-[var(--color-faint)] opacity-50 cursor-not-allowed",
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
          <h2 className="text-lg font-bold text-[var(--color-heading)]">
            Select a Table
          </h2>
          <p className="text-sm text-[var(--color-dimmed)]">
            Step 1 of 3 — Only available tables can be selected
          </p>
        </div>
        <button
          onClick={onCancel}
          className="text-sm text-[var(--color-dimmed)] hover:text-[var(--color-heading)]"
        >
          ✕ Cancel
        </button>
      </div>

      {/* Table grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {tables.map((table) => {
          const isAvailable = table.status === "AVAILABLE";
          return (
            <button
              key={table.id}
              disabled={!isAvailable}
              onClick={() => isAvailable && onSelect(table)}
              className={`
                bg-[var(--color-panel)] border rounded-xl p-4 text-left transition-all
                ${STATUS_STYLES[table.status]}
              `}
            >
              <p className="text-[var(--color-heading)] font-semibold mb-1">
                {table.table_number}
              </p>
              <p className="text-xs text-[var(--color-dimmed)] mb-2">
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
