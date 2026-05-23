const ConfirmModal = ({ show, onClose, onConfirm, message }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="rounded-xl p-6 w-80 bg-panel border border-panel-border shadow-lg">
        <h2 className="text-base font-semibold text-heading mb-2">
          Are you sure?
        </h2>
        <p className="text-sm text-dimmed mb-6">{message}</p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm text-dimmed hover:text-heading transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-brand text-white hover:bg-brand-hover transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
