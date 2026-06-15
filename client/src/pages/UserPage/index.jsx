import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import UserService from "../../services/user";
import UserTable from "./UserTable";
import UserModal from "./UserModal";
import DeleteConfirmModal from "./DeleteConfirmModal";

export default function UserPage() {
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // null = create mode, object = edit mode
  const [userToDelete, setUserToDelete] = useState(null);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      setLoading(true);
      setError(null);
      const data = await UserService.getUsers();
      setUsers(data.users);
      console.log(data.users);
    } catch (err) {
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // ── Open modals ──────────────────────────────────────────────────────────────

  function handleOpenCreate() {
    setSelectedUser(null);
    setFormError(null);
    setShowUserModal(true);
  }

  function handleOpenEdit(user) {
    setSelectedUser(user);
    setFormError(null);
    setShowUserModal(true);
  }

  function handleOpenDelete(user) {
    setUserToDelete(user);
    setShowDeleteModal(true);
  }

  // ── Close modals ─────────────────────────────────────────────────────────────

  function handleCloseUserModal() {
    setShowUserModal(false);
    setSelectedUser(null);
    setFormError(null);
  }

  function handleCloseDeleteModal() {
    setShowDeleteModal(false);
    setUserToDelete(null);
  }

  // ── Submit handlers ───────────────────────────────────────────────────────────

  async function handleSubmitUser(formData) {
    setSubmitting(true);
    setFormError(null);
    try {
      if (selectedUser) {
        // Edit mode — password is optional; strip it if empty
        const payload = { ...formData };
        if (!payload.password) delete payload.password;
        await UserService.updateUser(selectedUser.id, payload);
      } else {
        // Create mode
        await UserService.createUser(formData);
      }
      handleCloseUserModal();
      await fetchUsers();
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Something went wrong. Please try again.";
      setFormError(message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleConfirmDelete() {
    if (!userToDelete) return;
    setSubmitting(true);
    try {
      await UserService.deleteUser(userToDelete.id);
      handleCloseDeleteModal();
      await fetchUsers();
    } catch (err) {
      // Close modal anyway — show a page-level error if needed
      handleCloseDeleteModal();
      setError("Failed to deactivate user. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Derived stats ─────────────────────────────────────────────────────────────

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.isActive).length;
  const adminCount = users.filter((u) => u.role === "ADMIN").length;
  const staffCount = users.filter((u) => u.role === "STAFF").length;
  const kitchenCount = users.filter((u) => u.role === "KITCHEN").length;

  return (
    <div className="p-6 space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-heading)]">
            User Management
          </h1>
          <p className="text-sm text-[var(--color-dimmed)] mt-0.5">
            Manage staff accounts and role assignments
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-[#0e0e0e] font-medium text-sm transition-colors"
        >
          <span className="text-lg leading-none">+</span>
          Add User
        </button>
      </div>

      {/* ── Stats strip ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Users", value: totalUsers },
          { label: "Active", value: activeUsers },
          { label: "Admins", value: adminCount },
          { label: "Staff", value: staffCount + kitchenCount },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="bg-[var(--color-panel)] border border-[var(--color-panel-border)] rounded-xl px-4 py-3"
          >
            <p className="text-xs text-[var(--color-dimmed)] uppercase tracking-wider">
              {label}
            </p>
            <p className="text-2xl font-semibold text-[var(--color-heading)] mt-0.5">
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* ── Error banner ── */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* ── Table ── */}
      <UserTable
        users={users}
        loading={loading}
        currentUserId={currentUser?.id}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />

      {/* ── Modals ── */}
      {showUserModal && (
        <UserModal
          user={selectedUser}
          onSubmit={handleSubmitUser}
          onClose={handleCloseUserModal}
          submitting={submitting}
          error={formError}
        />
      )}

      {showDeleteModal && userToDelete && (
        <DeleteConfirmModal
          user={userToDelete}
          onConfirm={handleConfirmDelete}
          onClose={handleCloseDeleteModal}
          submitting={submitting}
        />
      )}
    </div>
  );
}
