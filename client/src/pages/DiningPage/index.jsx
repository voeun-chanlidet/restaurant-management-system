import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import FloorMap from "../../components/FloorMap";
import ConfirmModal from "../../components/ConfirmModal";
import tableService from "../../services/table";
import sessionService from "../../services/table_session";
import useTableSocket from "../../hooks/useTableSocket";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const FILTERS = ["ALL", "AVAILABLE", "OCCUPIED", "MAINTENANCE"];

const DiningPage = () => {
  const [tables, setTables] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
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
    fetchTables();
  }, []);

  const handleUpdate = useCallback((table) => {
    setTables((prev) =>
      prev.map((t) => (t.id === table.id ? { ...t, ...table } : t)),
    );
  }, []);

  const handleTableClick = async (table) => {
    if (table.status === "OCCUPIED") {
      try {
        const data = await sessionService.getActiveSessionByTable(table.id);
        navigate(`/dining/${table.id}`, {
          state: { session: data.activeSession },
        });
      } catch (err) {
        toast.error(err.response?.data?.error || "Failed to load session.");
      }
    } else {
      setSelectedTable(table);
      setShowSessionModal(true);
    }
  };

  const handleConfirmSession = async () => {
    try {
      const data = await sessionService.openSession({
        tableId: selectedTable.id,
      });
      toast.success("Session opened successfully.");
      navigate(`/dining/${selectedTable.id}`, {
        state: { session: data.session },
      });
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to open session.");
    }
  };

  useTableSocket({ onTableUpdate: handleUpdate });

  const filteredTables =
    filter === "ALL" ? tables : tables.filter((t) => t.status === filter);

  const counts = {
    total: tables.length,
    available: tables.filter((t) => t.status === "AVAILABLE").length,
    occupied: tables.filter((t) => t.status === "OCCUPIED").length,
    maintenance: tables.filter((t) => t.status === "MAINTENANCE").length,
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-medium text-heading">Floor map</h1>
        <p className="text-xs text-dimmed mt-0.5">
          Monitor table availability and dining activity
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-panel border border-panel-border rounded-xl px-4 py-3">
          <p className="text-[11px] text-dimmed mb-1 flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-faint" />
            Total tables
          </p>
          <p className="text-xl font-medium text-heading">{counts.total}</p>
        </div>
        <div className="bg-panel border border-panel-border rounded-xl px-4 py-3">
          <p className="text-[11px] text-dimmed mb-1 flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500" />
            Available
          </p>
          <p className="text-xl font-medium text-green-500">
            {counts.available}
          </p>
        </div>
        <div className="bg-panel border border-panel-border rounded-xl px-4 py-3">
          <p className="text-[11px] text-dimmed mb-1 flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange-500" />
            Occupied
          </p>
          <p className="text-xl font-medium text-orange-500">
            {counts.occupied}
          </p>
        </div>
        <div className="bg-panel border border-panel-border rounded-xl px-4 py-3">
          <p className="text-[11px] text-dimmed mb-1 flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-zinc-500" />
            Maintenance
          </p>
          <p className="text-xl font-medium text-zinc-400">
            {counts.maintenance}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs px-3.5 py-1.5 rounded-full border transition-colors ${
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
        confirmLabel="Open Session"
      />
    </div>
  );
};

export default DiningPage;
