import { useState, useEffect } from "react";
import orderService from "../../services/order";

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
    border: "border-emerald-500",
    badge: "bg-emerald-500/20 text-emerald-300",
    dot: "bg-emerald-400",
  },
  warning: {
    border: "border-amber-400",
    badge: "bg-amber-400/20 text-amber-300",
    dot: "bg-amber-400 animate-pulse",
  },
  urgent: {
    border: "border-red-500",
    badge: "bg-red-500/20 text-red-400",
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
    } catch (err) {
      console.error("Failed to mark ready:", err);
      setMarking(false);
    }
  };

  const styles = urgencyStyles[urgency];

  return (
    <div
      className={`
        relative flex flex-col bg-zinc-900 border-2 ${styles.border}
        rounded-xl overflow-hidden transition-all duration-500
        shadow-lg hover:shadow-xl hover:-translate-y-0.5
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-zinc-800/60 border-b border-zinc-700">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${styles.dot}`} />
          <span className="text-white font-bold text-lg tracking-wide font-mono">
            {order.tableNumber}
          </span>
        </div>
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-semibold ${styles.badge}`}
        >
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <path strokeLinecap="round" d="M12 6v6l4 2" strokeWidth="2" />
          </svg>
          {elapsed}
        </div>
      </div>

      {/* Items */}
      <div className="flex-1 px-4 py-3 space-y-2">
        {order.items.map((item) => (
          <div key={item.id} className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="shrink-0 w-6 h-6 rounded-md bg-zinc-700 text-zinc-200 text-xs font-bold font-mono flex items-center justify-center">
                {item.quantity}
              </span>
              <span className="text-zinc-100 text-sm font-medium">
                {item.menuName}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-zinc-700/60">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-zinc-500 text-xs">
            by {order.creator?.name ?? "—"}
          </span>
          <span className="text-zinc-400 text-xs font-mono">#{order.id}</span>
        </div>
        <button
          onClick={handleMarkReady}
          disabled={marking}
          className={`
            w-full py-2 rounded-lg text-sm font-bold tracking-wide transition-all duration-200
            ${
              marking
                ? "bg-zinc-700 text-zinc-500 cursor-not-allowed"
                : "bg-emerald-500 hover:bg-emerald-400 text-zinc-900 cursor-pointer active:scale-95"
            }
          `}
        >
          {marking ? "Marking..." : "Mark as Ready"}
        </button>
      </div>
    </div>
  );
};

export default OrderCard;
