import { useState } from "react";
import toast from "react-hot-toast";
import { useSettings } from "../../contexts/SettingsContext";

const OrderSummary = ({
  table,
  items,
  onSubmit,
  sessionId,
  onBack,
  onCancel,
}) => {
  const { formatPrice } = useSettings();
  const total = items.reduce((sum, item) => sum + item.subtotal, 0);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await onSubmit({
        tableId: table.id,
        items: items.map(({ menuId, quantity, note }) => ({
          menuId,
          quantity,
          ...(note && { note }),
        })),
        ...(sessionId && { sessionId }),
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place order.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 w-full max-w-3xl mx-auto mt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-gray-900">Review Order</h2>
        <button
          onClick={onCancel}
          className="text-sm font-medium text-gray-400 hover:text-gray-700 transition-colors"
        >
          ✕ Cancel
        </button>
      </div>

      {/* Items list */}
      <div className="border border-gray-200 rounded-xl overflow-hidden mb-6 bg-white">
        <div className="max-h-96 overflow-y-auto">
          {items.map((item, index) => (
            <div
              key={item.menuId}
              className={`flex items-start justify-between px-4 py-4 ${
                index !== items.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <div className="flex-1 pr-4">
                <p className="text-gray-900 text-sm font-medium">
                  {item.menuName}
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  {formatPrice(parseFloat(item.price))} × {item.quantity}
                </p>
                {/* Optional Note Display */}
                {item.note && (
                  <p className="text-gray-400 text-xs mt-1.5 italic bg-gray-50 p-1.5 rounded-md">
                    Note: {item.note}
                  </p>
                )}
              </div>
              <span className="text-gray-900 font-semibold text-sm whitespace-nowrap">
                {formatPrice(parseFloat(item.subtotal))}
              </span>
            </div>
          ))}
        </div>

        {/* Total row */}
        <div className="flex items-center justify-between px-4 py-4 bg-gray-50 border-t border-gray-200">
          <span className="text-gray-900 font-bold">Total</span>
          <span className="text-brand font-bold text-lg">
            {formatPrice(total)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 py-3 rounded-lg text-sm font-medium transition-all"
        >
          ← Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="flex-2 bg-brand hover:bg-brand-hover text-white font-semibold px-8 py-3 rounded-lg text-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {submitting ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Placing...
            </span>
          ) : (
            "Place Order"
          )}
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;
