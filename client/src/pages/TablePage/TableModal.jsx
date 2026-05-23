import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";

const STATUSES = ["AVAILABLE", "OCCUPIED", "RESERVED", "MAINTENANCE"];

const TableModal = ({ isOpen, onClose, onSave, onDelete, editingTable }) => {
  const { user } = useAuth();
  const [tableNumber, setTableNumber] = useState("");
  const [capacity, setCapacity] = useState("");
  const [status, setStatus] = useState("AVAILABLE");
  const [shape, setShape] = useState("round");

  useEffect(() => {
    if (editingTable) {
      setTableNumber(editingTable.table_number);
      setCapacity(editingTable.capacity);
      setStatus(editingTable.status);
      setShape(editingTable.shape || "round");
    } else {
      setTableNumber("");
      setCapacity("");
      setStatus("AVAILABLE");
      setShape("round");
    }
  }, [editingTable, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!tableNumber.trim() || !capacity) return;
    onSave({
      table_number: tableNumber.trim(),
      capacity: parseInt(capacity),
      status,
      shape,
    });
  };

  const inputClass =
    "w-full bg-[var(--color-input)] border border-[var(--color-panel-border)] rounded-lg px-3 py-2 text-sm text-[var(--color-heading)] focus:outline-none focus:border-[var(--color-brand)]";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-panel border border-panel-border rounded-2xl p-6 w-full max-w-sm mx-4">
        <h2 className="text-base font-medium text-heading mb-5">
          {editingTable ? "Edit table" : "Add table"}
        </h2>

        <div className="flex flex-col gap-4">
          {/* Table number — admin only */}
          {user.role === "ADMIN" && (
            <div>
              <label className="block text-xs text-dimmed mb-1.5">
                Table number
              </label>
              <input
                type="text"
                className={inputClass}
                placeholder="e.g. T1, A2"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
              />
            </div>
          )}

          {/* Capacity — admin only */}
          {user.role === "ADMIN" && (
            <div>
              <label className="block text-xs text-dimmed mb-1.5">
                Capacity
              </label>
              <input
                type="number"
                className={inputClass}
                placeholder="4"
                min={1}
                max={20}
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
              />
            </div>
          )}

          {/* Status — everyone can change */}
          <div>
            <label className="block text-xs text-dimmed mb-1.5">Status</label>
            <select
              className={inputClass}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0) + s.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Shape — admin only */}
          {user.role === "ADMIN" && (
            <div>
              <label className="block text-xs text-dimmed mb-1.5">Shape</label>
              <div className="flex gap-2">
                {["round", "rect"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setShape(s)}
                    className={`flex-1 py-1.5 text-xs rounded-lg border transition-colors ${
                      shape === s
                        ? "border-brand text-brand bg-brand/10"
                        : "border-panel-border text-dimmed"
                    }`}
                  >
                    {s === "round" ? "Round" : "Rectangle"}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mt-6">
          {/* Delete — admin only */}
          {editingTable && user.role === "ADMIN" && (
            <button
              onClick={() => onDelete(editingTable.id)}
              className="text-xs text-red-500 border border-red-500/30 rounded-lg px-3 py-1.5 hover:bg-red-500/10 transition-colors mr-auto"
            >
              Delete
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs text-dimmed border border-panel-border rounded-lg px-4 py-1.5 hover:bg-input transition-colors"
          >
            Cancel
          </button>
          {/* Save — admin only */}
          {user.role === "ADMIN" && (
            <button
              onClick={handleSave}
              className="text-xs font-medium rounded-lg px-4 py-1.5 transition-colors"
              style={{ background: "var(--color-brand)", color: "#0e0e0e" }}
            >
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TableModal;
