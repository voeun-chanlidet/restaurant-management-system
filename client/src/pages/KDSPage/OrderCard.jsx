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

const urgencyStyles = {
  fresh: {
    border: "border-green-400",
    badge: "bg-green-100 text-green-700",
    dot: "bg-green-500",
  },
  warning: {
    border: "border-yellow-400",
    badge: "bg-yellow-100 text-yellow-700",
    dot: "bg-yellow-500 animate-pulse",
  },
  urgent: {
    border: "border-red-500",
    badge: "bg-red-100 text-red-700",
    dot: "bg-red-500 animate-pulse",
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
      className={`relative flex flex-col bg-white border-2 ${styles.border}
      rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all`}
    >
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-100 border-b">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${styles.dot}`} />
          <span className="text-gray-900 font-bold text-lg tracking-wide">
            {order.tableNumber || "—"}
          </span>
        </div>

        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${styles.badge}`}
        >
          ⏱ {elapsed}
        </div>
      </div>

      {/* ================= ITEMS ================= */}
      <div className="flex-1 px-4 py-3 space-y-2">
        {order.items.map((item) => (
          <div key={item.id} className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded bg-gray-200 text-gray-800 text-xs font-bold flex items-center justify-center">
                {item.quantity}
              </span>
              <span className="text-gray-900 text-sm font-medium">
                {item.menuName}
              </span>
              {item.note && (
                <p className="text-xs text-yellow-600 mt-0.5">
                  Note: {item.note}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ================= FOOTER ================= */}
      <div className="px-4 py-3 border-t bg-gray-50">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-gray-500 text-xs">
            {order.creator ? `Staff (${order.creator.name})` : "QR"}
          </span>

          <span className="text-gray-400 text-xs">#{order.id}</span>
        </div>

        <button
          onClick={handleMarkReady}
          disabled={marking}
          className={`
            w-full py-2 rounded-lg text-sm font-semibold transition-all
            ${
              marking
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 text-white active:scale-95"
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
