import { useState, useEffect } from "react";
import orderService from "../../services/order";
import toast from "react-hot-toast";

const getElapsed = (createdAt) => {
  const diff = Math.floor((Date.now() - new Date(createdAt)) / 1000);
  const m = Math.floor(diff / 60);
  const s = diff % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

const getUrgency = (createdAt) => {
  const minutes = (Date.now() - new Date(createdAt)) / 60000;
  if (minutes >= 15) return "urgent";
  if (minutes >= 8) return "warning";
  return "fresh";
};

// Adapted colors to match the clean aesthetic of the new design
const urgencyStyles = {
  fresh: {
    border: "border-gray-200",
    badge: "bg-green-50 text-green-600",
    iconBg: "bg-green-100 text-green-600",
    statusText: "FRESH",
  },
  warning: {
    border: "border-yellow-300",
    badge: "bg-yellow-50 text-yellow-600",
    iconBg: "bg-yellow-100 text-yellow-600",
    statusText: "WARNING",
  },
  urgent: {
    border: "border-red-300 shadow-sm",
    badge: "bg-red-50 text-red-600",
    iconBg: "bg-red-100 text-red-600",
    statusText: "URGENT",
  },
};

const OrderCard = ({ order, onMarkReady }) => {
  const [elapsed, setElapsed] = useState(getElapsed(order.createdAt));
  const [urgency, setUrgency] = useState(getUrgency(order.createdAt));
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(getElapsed(order.createdAt));
      setUrgency(getUrgency(order.createdAt));
    }, 1000);
    return () => clearInterval(interval);
  }, [order.createdAt]);

  const handleMarkReady = async () => {
    setMarking(true);
    try {
      await orderService.updateOrderStatus(order.id, "READY");
      onMarkReady(order.id);
      toast.success("Order status updated successfully.");
    } catch (error) {
      toast.error(error.response?.data?.error || "Update status failed");
      setMarking(false);
    }
  };

  const styles = urgencyStyles[urgency];

  return (
    <div
      className={`flex flex-col bg-white border ${styles.border} rounded-xl overflow-hidden shadow-sm`}
    >
      {/* ================= HEADER (Matches Image Style) ================= */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Mock Document Icon from Image */}
          <div className={`p-1.5 rounded-lg ${styles.iconBg}`}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <h2 className="text-gray-900 font-bold text-lg">Order #{order.id}</h2>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles.badge}`}
          >
            • {styles.statusText}
          </span>
        </div>
      </div>

      {/* ================= INFO BAR ================= */}
      <div className="px-4 py-2 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center text-sm">
        <div className="text-gray-500">
          Table{" "}
          <span className="font-bold text-gray-900 ml-1">
            {order.tableNumber || "T-"}
          </span>
        </div>
        <div className="font-semibold text-gray-700 flex items-center gap-1.5">
          ⏱ {elapsed}
        </div>
      </div>

      {/* ================= ITEMS ================= */}
      <div className="flex-1 px-4 py-4 space-y-4">
        {order.items.map((item) => (
          <div key={item.id} className="flex flex-col">
            {/* Item Header: Name & Quantity */}
            <div className="flex items-start justify-between gap-4">
              <span className="text-gray-900 font-semibold text-base leading-tight">
                {item.menuName}
                {console.log(item)}
              </span>

              {/* Quantity Pill (Matches Image) */}
              <span className="shrink-0 px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-sm font-semibold border border-gray-200">
                x {item.quantity}
              </span>
            </div>

            {/* Note Box (Matches Image) */}
            {/* Order Note */}
            {item.note && (
              <div className="px-4 py-2 border-b border-gray-100 bg-amber-50/50 flex items-start gap-2">
                <svg
                  className="text-amber-500 shrink-0 mt-0.5"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                <div>
                  <span className="text-sm text-gray-400 font-medium mb-0.5 block">
                    Note from customer
                  </span>
                  <span className="text-amber-600 text-sm font-medium">
                    {item.note}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ================= FOOTER ================= */}
      <div className="p-3 border-t border-gray-100">
        <button
          onClick={handleMarkReady}
          disabled={marking}
          className={`
            w-full py-2.5 rounded-lg text-sm font-bold transition-all
            ${
              marking
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 text-white shadow-sm"
            }
          `}
        >
          {marking ? "Marking..." : "Mark Ready"}
        </button>
      </div>
    </div>
  );
};

export default OrderCard;
