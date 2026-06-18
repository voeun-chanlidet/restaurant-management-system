import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import tableService from "../../services/table";
import FloorMap from "../../components/FloorMap/index";
import TableModal from "./TableModal";
import ConfirmModal from "../../components/ConfirmModal";
import toast from "react-hot-toast";

const FILTERS = ["ALL", "AVAILABLE", "OCCUPIED", "MAINTENANCE"];
const TablePage = () => {
  const [tables, setTables] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
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

  const openAddModal = () => {
    setEditingTable(null);
    setIsModalOpen(true);
  };
  const openEditModal = (table) => {
    setEditingTable(table);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTable(null);
  };

  const handleSave = async (formData) => {
    try {
      if (editingTable) {
        await tableService.updateTable(editingTable.id, formData);
        toast.success("Table edited successfully.");
      } else {
        await tableService.createTable(formData);
        toast.success("Table created successfully.");
      }
      closeModal();
      fetchTables();
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleUpdate = useCallback((table) => {
    setTables((prev) => prev.map((t) => (t.id === table.id ? table : t)));
  }, []);

  const handleDelete = async (id) => {
    try {
      await tableService.deleteTable(id);
      toast.success("Table deleted successfully.");
      closeModal();
      fetchTables();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to delete table.");
    }
  };

  const filteredTables =
    filter === "ALL" ? tables : tables.filter((t) => t.status === filter);

  const counts = {
    total: tables.length,
    available: tables.filter((t) => t.status === "AVAILABLE").length,
    occupied: tables.filter((t) => t.status === "OCCUPIED").length,
  };
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-medium text-heading">Floor map</h1>
          <p className="text-sm text-dimmed mt-0.5">
            {counts.total} tables · {counts.available} available ·{" "}
            {counts.occupied} occupied
          </p>
        </div>
        {user.role === "ADMIN" && (
          <>
            <button
              onClick={openAddModal}
              className="hidden sm:flex bg-brand text-white items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg transition-colors "
            >
              + Add table
            </button>
            <button
              onClick={openAddModal}
              className="sm:hidden bg-brand text-white fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl font-bold transition-colors"
            >
              +
            </button>
          </>
        )}
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
        <FloorMap tables={filteredTables} onEdit={openEditModal} />
      )}
      <TableModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSave}
        onDelete={handleDelete}
        editingTable={editingTable}
      />
    </div>
  );
};

export default TablePage;
