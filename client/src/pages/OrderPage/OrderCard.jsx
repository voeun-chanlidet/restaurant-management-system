import { useState, useEffect } from "react";
import { useSettings } from "../../contexts/SettingsContext";
import { getNextStatus, canAdvanceOrder } from "../../utils/orderStatus";
import { useAuth } from "../../contexts/AuthContext";

const STATUS_CONFIG = {
  PENDING: {
    border: "border-l-amber-400",
    pill: "bg-amber-50 text-amber-500",
    elapsedText: "text-red-500",
    actionBg: "bg-amber-50 text-amber-600 border-amber-200",
    actionLabel: "Start Preparing",
    ActionIcon: () => (
      <svg
        className="w-3.5 h-3.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  IN_PROGRESS: {
    border: "border-l-blue-400",
    pill: "bg-blue-50 text-blue-500",
    elapsedText: "text-red-500",
    actionBg: "bg-blue-50 text-blue-600 border-blue-200",
    actionLabel: "Mark Ready",
    ActionIcon: () => (
      <svg
        className="w-3.5 h-3.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  READY: {
    border: "border-l-emerald-400",
    pill: "bg-emerald-50 text-emerald-500",
    elapsedText: "text-emerald-500",
    actionBg: "bg-emerald-50 text-emerald-600 border-emerald-200",
    actionLabel: "Mark Served",
    ActionIcon: () => (
      <svg
        className="w-3.5 h-3.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  SERVED: {
    border: "border-l-gray-300",
    pill: "bg-gray-100 text-gray-500",
    elapsedText: "text-gray-400",
    actionBg: "bg-white text-gray-400 border-gray-200",
    actionLabel: "Completed",
    ActionIcon: () => (
      <svg
        className="w-3.5 h-3.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  CANCELLED: {
    border: "border-l-red-400",
    pill: "bg-red-50 text-red-500",
    elapsedText: "text-gray-400",
    actionBg: "bg-white text-gray-400 border-gray-200",
    actionLabel: "Cancelled",
    ActionIcon: () => (
      <svg
        className="w-3.5 h-3.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
        />
      </svg>
    ),
  },
};
const calcElapsed = (createdAt, endAt = Date.now()) => {
  const diff = Math.max(
    0,
    Math.floor((new Date(endAt) - new Date(createdAt)) / 1000),
  );
  const h = Math.floor(diff / 3600);
  const m = Math.floor((diff % 3600) / 60);
  const s = diff % 60;

  if (h > 0)
    return `${h}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;
  return `${m}m ${String(s).padStart(2, "0")}s`;
};

const STOPPED_STATUSES = ["SERVED", "CANCELLED"];

const OrderCard = ({ order, onClick, onStatusUpdate }) => {
  const { formatPrice } = useSettings();
  const { user } = useAuth();
  const config = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
  const nextStatus = getNextStatus(order.status);
  const canAdvance = canAdvanceOrder(user.role, order.status);

  // const [elapsed, setElapsed] = useState(() => calcElapsed(order.createdAt));
  const [elapsed, setElapsed] = useState(() =>
    STOPPED_STATUSES.includes(order.status)
      ? calcElapsed(order.createdAt, order.servedAt || order.updatedAt)
      : calcElapsed(order.createdAt),
  );

  // useEffect(() => {
  //   setElapsed(calcElapsed(order.createdAt));

  //   if (STOPPED_STATUSES.includes(order.status)) return;

  //   const interval = setInterval(() => {
  //     setElapsed(calcElapsed(order.createdAt));
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, [order.createdAt, order.status]);
  useEffect(() => {
    if (STOPPED_STATUSES.includes(order.status)) {
      setElapsed(
        calcElapsed(order.createdAt, order.servedAt || order.updatedAt),
      );
      return;
    }
    setElapsed(calcElapsed(order.createdAt));
    const interval = setInterval(() => {
      setElapsed(calcElapsed(order.createdAt));
    }, 1000);
    return () => clearInterval(interval);
  }, [order.createdAt, order.status, order.servedAt, order.updatedAt]);

  const sourceLabel = order.creator
    ? `Staff (${order.creator.name})`
    : "QR Customer";

  const totalQty = order.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;

  const orderTime = new Date(order.createdAt).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const ActionIcon = config.ActionIcon;

  return (
    <div
      onClick={() => onClick(order)}
      className={`bg-white border-y border-r border-gray-200 border-l-4 rounded-xl p-4 flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer ${config.border}`}
    >
      {/* HEADER */}
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-gray-900 font-bold text-base">
          Table {order.tableNumber || "—"}
        </h3>
        <span
          className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${config.pill}`}
        >
          {order.status.replace("_", " ")}
        </span>
      </div>

      {/* META */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-gray-400">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Order Time</span>
          </div>
          <span className="font-semibold text-gray-800">{orderTime}</span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-gray-400">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Time Elapsed</span>
          </div>
          <span className={`font-bold ${config.elapsedText}`}>{elapsed}</span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-gray-400">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span>Source</span>
          </div>
          <span className="font-semibold text-gray-800">{sourceLabel}</span>
        </div>
      </div>

      {/* ITEMS & TOTAL */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 mb-4 text-xs">
        <div className="flex items-center gap-2 text-gray-400">
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <span>Items ({totalQty})</span>
        </div>
        <span className="font-bold text-red-600 text-sm">
          {formatPrice(order.total)}
        </span>
      </div>

      {/* ACTIONS */}
      <div className="flex items-center gap-2">
        <button
          disabled={!canAdvance}
          onClick={(e) => {
            e.stopPropagation();
            onStatusUpdate(order.id, nextStatus);
          }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 border rounded-lg text-xs font-semibold transition-colors ${config.actionBg} cursor-pointer`}
        >
          <ActionIcon />
          {config.actionLabel}
        </button>
      </div>
    </div>
  );
};

export default OrderCard;
