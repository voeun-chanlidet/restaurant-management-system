import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import FloorMap from "../../components/FloorMap";

import ConfirmModal from "../../components/ConfirmModal";
import tableService from "../../services/table";
import sessionService from "../../services/table_session";
import useTableSocket from "./useTableSocket";
import { useNavigate } from "react-router-dom";

const FILTERS = ["ALL", "AVAILABLE", "OCCUPIED", "RESERVED", "MAINTENANCE"];

const DiningPage = () => {
  const [tables, setTables] = useState([]);
  const [filter, setFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const navigate = useNavigate();

  const fetchTables = async () => {
    try {
      setLoading(true);
      const data = await tableService.getAllTables();
      setTables(data.tables);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const handleUpdate = useCallback((table) => {
    setTables((prev) => prev.map((t) => (t.id === table.id ? table : t)));
  }, []);

  const handleTableClick = async (table) => {
    if (table.status === "OCCUPIED") {
      const data = await sessionService.getActiveSessionByTable(table.id);
      navigate(`/dining/${table.id}`, {
        state: { session: data.activeSession },
      });
    } else {
      setSelectedTable(table);
      setShowSessionModal(true);
    }
  };

  const handleConfirmSession = async () => {
    const data = await sessionService.openSession({
      tableId: selectedTable.id,
    });
    navigate(`/dining/${selectedTable.id}`, {
      state: { session: data.session },
    });
  };

  useTableSocket({ onTableUpdate: handleUpdate });

  const filteredTables =
    filter === "ALL" ? tables : tables.filter((t) => t.status === filter);

  const counts = {
    total: tables.length,
    available: tables.filter((t) => t.status === "AVAILABLE").length,
    occupied: tables.filter((t) => t.status === "OCCUPIED").length,
    reserved: tables.filter((t) => t.status === "RESERVED").length,
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-medium text-heading">Floor map</h1>
          <p className="text-xs text-dimmed mt-0.5">
            {counts.total} tables · {counts.available} available ·{" "}
            {counts.occupied} occupied · {counts.reserved} reserved
          </p>
        </div>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              filter === f
                ? "border-brand text-brand bg-brand/10"
                : "border-panel-border text-dimmed hover:border-faint"
            }`}
          >
            {f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {loading && (
        <p className="text-sm text-dimmed py-12 text-center">
          Loading tables...
        </p>
      )}

      {error && (
        <p className="text-sm text-red-500 py-12 text-center">{error}</p>
      )}

      {!loading && !error && (
        <FloorMap tables={filteredTables} onTableClick={handleTableClick} />
      )}

      <ConfirmModal
        show={showSessionModal}
        onClose={() => setShowSessionModal(false)}
        onConfirm={handleConfirmSession}
        message={`Open session for table ${selectedTable?.table_number}?`}
        confirmLabel={"Open Session"}
      />
    </div>
  );
};

export default DiningPage;
