import api from "../../services/api";
import toast from "react-hot-toast";
import { useState } from "react";

const PaymentDetailModal = ({ payment, onClose }) => {
  const allItems = payment.session?.orders?.flatMap((o) => o.items) || [];

  const subtotal = allItems.reduce(
    (sum, item) => sum + Number(item.subtotal),
    0,
  );
  const [downloading, setDownloading] = useState(false);

  const handleDownloadReceipt = async () => {
    try {
      setDownloading(true);
      const response = await api.get(`/payments/${payment.id}/receipt`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `receipt-${payment.id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error("Failed to download receipt.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 "
    >
      <div
        className="bg-panel border border-panel-border rounded-2xl w-full max-w-sm overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b border-panel-border">
          <div>
            <h2 className="text-2xl font-bold text-heading">
              Payment #{payment.id}
            </h2>

            <p className="text-dimmed mt-1">
              Table {payment.session?.table?.table_number ?? "—"}
            </p>

            <p className="text-xs text-dimmed mt-0.5">
              {new Date(payment.createdAt).toLocaleString()}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-2xl text-dimmed hover:text-heading transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Payment Info */}
        <div className="px-6 py-5 border-b border-panel-border space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-dimmed">Processed By</span>
            <span className="font-medium text-heading">
              {payment.processor?.name ?? "—"}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-dimmed">Method</span>

            <span
              className={`px-2.5 py-1 rounded-full text-xs font-semibold
              ${
                payment.method === "CASH"
                  ? "bg-green-500/15 text-green-500"
                  : payment.method === "KHQR"
                    ? "bg-blue-500/15 text-blue-500"
                    : "bg-purple-500/15 text-purple-500"
              }`}
            >
              {payment.method}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-dimmed">Status</span>

            <span className="text-green-500 font-semibold">Paid</span>
          </div>

          {payment.method === "CASH" && (
            <>
              <div className="flex justify-between">
                <span className="text-sm text-dimmed">Cash Received</span>

                <span className="text-heading">
                  ${Number(payment.cashReceived).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-dimmed">Change</span>

                <span className="text-heading">
                  ${Number(payment.change).toFixed(2)}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Items */}
        <div className="px-6 py-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs uppercase tracking-[0.2em] text-dimmed">
              Items
            </h3>

            <span className="text-xs text-dimmed">
              {allItems.length} item{allItems.length !== 1 && "s"}
            </span>
          </div>

          <div className="space-y-2  pr-1">
            {allItems.length === 0 ? (
              <p className="text-sm text-dimmed text-center py-6">
                No items found.
              </p>
            ) : (
              allItems.map((item, index) => (
                <div key={index} className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-heading">{item.menuName}</p>

                    <p className="text-xs text-dimmed">
                      ${Number(item.price).toFixed(2)} × {item.quantity}
                    </p>
                  </div>

                  <span className="font-semibold text-heading">
                    ${Number(item.subtotal).toFixed(2)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="px-6 py-2 mb-2 space-y-2">
          {/* <div className="flex items-center justify-between text-sm">
            <span className="text-dimmed">Subtotal</span>
            <span className="text-heading">${subtotal.toFixed(2)}</span>
          </div> */}

          <div className="border-t border-panel-border pt-4 flex justify-between items-center">
            <span className="text-lg font-semibold text-heading">Total</span>

            <span className="text-3xl font-bold text-heading">
              ${Number(payment.totalAmount).toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleDownloadReceipt}
            disabled={downloading}
            className="w-full bg-brand text-white py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-colors mt-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {downloading ? "Downloading..." : "Download Receipt"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailModal;
