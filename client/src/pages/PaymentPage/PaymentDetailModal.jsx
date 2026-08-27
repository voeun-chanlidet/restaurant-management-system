import api from "../../services/api";
import toast from "react-hot-toast";
import { useState } from "react";
import { useSettings } from "../../contexts/SettingsContext";
import printReceipt from "../../utils/printReceipt";

const PaymentDetailModal = ({ payment, onClose }) => {
  const allItems = payment.session?.orders?.flatMap((o) => o.items) || [];
  const [downloading, setDownloading] = useState(false);
  const {
    formatPrice,
    formatByCurrency,
    restaurantName,
    address,
    phone,
    exchangeRate,
    footerMessage,
  } = useSettings();

  const displayCashReceived = payment?.cashReceived;
  const displayChange = payment?.changeAmount;
  const isKhr = payment?.paymentCurrency === "KHR";
  const paymentExchangeRate = Number(payment?.exchangeRate || exchangeRate);
  const formatHistoricalPrice = (amount) => {
    const num = Number(amount || 0);

    if (isKhr) {
      return `${Math.round(num * paymentExchangeRate).toLocaleString()} រៀល`;
    }

    return `$${num.toFixed(2)}`;
  };

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
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div
        className="bg-white border border-gray-100 rounded-2xl w-full max-w-lg overflow-y-auto max-h-[90vh] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-gray-900">Payment</h2>
              <span className="bg-green-50 text-green-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                PAID
              </span>
            </div>
            <p className="text-gray-500 text-sm mt-1">
              Table {payment.session?.table?.table_number ?? "—"} ·{" "}
              {new Date(payment.createdAt).toLocaleString()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-900 transition"
          >
            ✕
          </button>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-4 p-6 border-b border-gray-100">
          {[
            {
              label: "Processed By",
              value: payment.processor?.name || "Admin",
            },
            { label: "Method", value: payment.method, highlight: true },
            { label: "Status", value: "Paid", color: "text-green-600" },
            {
              label: "Receipt #",
              value: `RCPT-${String(payment.id).padStart(5, "0") || "—"}`,
            },
          ].map((item, i) => (
            <div key={i}>
              <p className="text-[11px] text-gray-400 uppercase tracking-wide">
                {item.label}
              </p>
              <p
                className={`font-semibold text-sm ${item.color || "text-gray-900"}`}
              >
                {item.highlight ? (
                  <span className="bg-green-50 text-green-600 px-2 py-0.5 rounded">
                    {item.value}
                  </span>
                ) : (
                  item.value
                )}
              </p>
            </div>
          ))}
        </div>

        {/* Payment Summary Box */}
        <div className="px-6 py-4 bg-gray-50/50">
          <h3 className="text-xs font-bold text-gray-900 mb-3">
            Payment Summary
          </h3>
          <div className="flex justify-between items-center">
            {payment.method === "CASH" && (
              <div>
                <p className="text-gray-500 text-sm">Cash Received</p>
                <p className="text-gray-900 font-bold text-xl">
                  {formatByCurrency(
                    displayCashReceived,
                    payment.paymentCurrency,
                  )}
                </p>
                <p className="text-green-600 font-bold text-sm">
                  Change:{" "}
                  {formatByCurrency(displayChange, payment.changeCurrency)}
                </p>
              </div>
            )}
            <div className={payment.method === "CASH" ? "text-right" : ""}>
              <p className="text-gray-500 text-sm">Total Paid</p>
              <p className="text-gray-900 font-bold text-3xl">
                {formatByCurrency(payment.totalAmount, payment.totalCurrency)}
              </p>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="px-6 py-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-bold text-gray-900 uppercase">
              Items ({allItems.length})
            </h3>
          </div>

          <div className="space-y-4">
            {allItems.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.menuName}
                      className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl object-cover border border-gray-100 bg-gray-50 shrink-0"
                    />
                  )}
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      {item.menuName}
                    </p>
                    <p className="text-xs text-gray-400">
                      {/* {formatPrice(Number(item.price))} each */}
                      {formatHistoricalPrice(Number(item.price))} each
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">x{item.quantity}</p>
                  <p className="font-bold text-gray-900 text-sm">
                    {/* {formatPrice(Number(item.subtotal))} */}
                    {formatHistoricalPrice(Number(item.subtotal))}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 flex gap-3">
          <button
            onClick={handleDownloadReceipt}
            disabled={downloading}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2"
          >
            {downloading ? "Downloading..." : "Download Receipt"}
          </button>
          <button
            onClick={() =>
              printReceipt(payment, formatPrice, {
                restaurantName,
                address,
                phone,
                footerMessage,
                exchangeRate,
              })
            }
            className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-900 py-3 rounded-xl text-sm font-bold transition"
          >
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailModal;
