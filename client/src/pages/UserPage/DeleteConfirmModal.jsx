export default function DeleteConfirmModal({
  user,
  onConfirm,
  onClose,
  submitting,
}) {
  // Since we use soft delete (isActive toggle), action depends on current state
  const action = user.isActive ? "deactivate" : "reactivate";
  const actionLabel = user.isActive ? "Deactivate" : "Reactivate";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-panel border border-panel-border rounded-2xl shadow-2xl">
        <div className="px-6 py-6 space-y-4">
          {/* Icon */}
          <div
            className={`w-11 h-11 rounded-full flex items-center justify-center ${
              user.isActive
                ? "bg-red-500/10 border border-red-500/20"
                : "bg-emerald-500/10 border border-emerald-500/20"
            }`}
          >
            {user.isActive ? (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="w-5 h-5 text-red-400"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="23" y1="18" x2="17" y2="18" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="w-5 h-5 text-emerald-400"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="23" y1="18" x2="17" y2="18" />
                <line x1="20" y1="15" x2="20" y2="21" />
              </svg>
            )}
          </div>

          {/* Text */}
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-heading">
              {actionLabel} {user.name}?
            </h3>
            <p className="text-sm text-dimmed leading-relaxed">
              {user.isActive
                ? `This will prevent ${user.name} from logging in. Their data and history will be preserved. You can reactivate them at any time.`
                : `This will restore ${user.name}'s access. They will be able to log in again immediately.`}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-panel-border text-sm font-medium text-dimmed hover:text-heading hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={submitting}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                user.isActive
                  ? "bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30"
                  : "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30"
              }`}
            >
              {submitting
                ? `${actionLabel.replace("e", "ing")}...`
                : actionLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
