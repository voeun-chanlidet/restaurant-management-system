const ROLE_STYLES = {
  ADMIN: "bg-purple-500/15 text-purple-300 border border-purple-500/25",
  STAFF: "bg-blue-500/15 text-blue-300 border border-blue-500/25",
  KITCHEN: "bg-orange-500/15 text-orange-300 border border-orange-500/25",
};

const ROLE_LABELS = {
  ADMIN: "Admin",
  STAFF: "Staff",
  KITCHEN: "Kitchen",
};

export default function UserTable({
  users,
  loading,
  currentUserId,
  onEdit,
  onDelete,
}) {
  if (loading) {
    return (
      <div className="bg-panel border border-panel-border rounded-xl overflow-hidden">
        <div className="p-8 flex items-center justify-center">
          <div className="flex items-center gap-3 text-dimmed">
            <svg
              className="w-5 h-5 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            <span className="text-sm">Loading users...</span>
          </div>
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="bg-panel border border-panel-border rounded-xl overflow-hidden">
        <div className="p-12 flex flex-col items-center justify-center gap-3 text-center">
          <div className="w-12 h-12 rounded-full bg-panel-border flex items-center justify-center">
            <svg
              className="w-6 h-6 text-dimmed"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <p className="text-heading font-medium">No users yet</p>
          <p className="text-sm text-dimmed">
            Add your first team member to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-panel border border-panel-border rounded-xl overflow-hidden">
      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-panel-border">
              {["Name", "Email", "Role", "Status", "Actions"].map((col) => (
                <th
                  key={col}
                  className={`px-5 py-3.5 text-xs font-medium uppercase tracking-wider text-dimmed ${
                    col === "Actions" ? "text-right" : "text-left"
                  }`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-panel-border">
            {users.map((user) => {
              const isCurrentUser = user.id === currentUserId;
              return (
                <tr
                  key={user.id}
                  className="hover:bg-white/2 transition-colors"
                >
                  {/* Name */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand/20 border border-brand/30 flex items-center justify-center shrink-0">
                        <span className="text-xs font-semibold text-brand">
                          {user.name?.charAt(0)?.toUpperCase() || "?"}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-heading">
                          {user.name}
                          {isCurrentUser && (
                            <span className="ml-2 text-[10px] font-normal text-dimmed bg-white/5 px-1.5 py-0.5 rounded">
                              you
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-5 py-4 text-dimmed">{user.email}</td>

                  {/* Role */}
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        ROLE_STYLES[user.role] || "bg-white/5 text-white/50"
                      }`}
                    >
                      {ROLE_LABELS[user.role] || user.role}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                        user.isActive ? "text-emerald-400" : "text-dimmed"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          user.isActive ? "bg-emerald-400" : "bg-dimmed)]"
                        }`}
                      />
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(user)}
                        className="px-3 py-1.5 rounded-md text-xs font-medium text-dimmed hover:text-heading hover:bg-white/5 transition-colors"
                      >
                        Edit
                      </button>
                      {!isCurrentUser && (
                        <button
                          onClick={() => onDelete(user)}
                          className="px-3 py-1.5 rounded-md text-xs font-medium text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          {user.isActive ? "Deactivate" : "Activate"}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden divide-y divide-panel-border">
        {users.map((user) => {
          const isCurrentUser = user.id === currentUserId;
          return (
            <div key={user.id} className="px-4 py-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-brand/20 border border-brand/30 flex items-center justify-center shrink-0">
                    <span className="text-sm font-semibold text-brand">
                      {user.name?.charAt(0)?.toUpperCase() || "?"}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-heading text-sm truncate">
                      {user.name}
                      {isCurrentUser && (
                        <span className="ml-1.5 text-[10px] text-dimmed">
                          (you)
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-dimmed truncate">{user.email}</p>
                  </div>
                </div>
                <span
                  className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    ROLE_STYLES[user.role] || "bg-white/5 text-white/50"
                  }`}
                >
                  {ROLE_LABELS[user.role] || user.role}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex items-center gap-1.5 text-xs ${
                    user.isActive ? "text-emerald-400" : "text-dimmed"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      user.isActive ? "bg-emerald-400" : "bg-dimmed"
                    }`}
                  />
                  {user.isActive ? "Active" : "Inactive"}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(user)}
                    className="px-3 py-1.5 rounded-md text-xs font-medium text-dimmed hover:text-heading hover:bg-white/5 transition-colors"
                  >
                    Edit
                  </button>
                  {!isCurrentUser && (
                    <button
                      onClick={() => onDelete(user)}
                      className="px-3 py-1.5 rounded-md text-xs font-medium text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      {user.isActive ? "Deactivate" : "Activate"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer count */}
      <div className="px-5 py-3 border-t border-panel-border">
        <p className="text-xs text-dimmed">
          {users.length} {users.length === 1 ? "user" : "users"} total
        </p>
      </div>
    </div>
  );
}
