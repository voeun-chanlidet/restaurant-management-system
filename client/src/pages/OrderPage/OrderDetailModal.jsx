import { useContext, useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useSettings } from "../../contexts/SettingsContext";
import {
  STATUS_STYLES,
  STATUS_DOT_COLORS,
  STATUS_FLOW,
  STATUS_BUTTON_LABEL,
  getNextStatus,
  canAdvanceOrder,
  canCancelOrder,
  getStatusMessaging,
} from "../../utils/orderStatus";

const OrderDetailModal = ({
  order,
  onClose,
  onStatusUpdate,
  onCancel,
  isLoading,
}) => {
  const { user } = useAuth();
  const { formatPrice } = useSettings();
  const [updating, setUpdating] = useState(false);

  // Prevent background scroll when modal layout opens
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  if (!order) return null;

  const nextStatus = getNextStatus(order.status);
  const canAdvance = canAdvanceOrder(user?.role, order.status);
  const canCancel = canCancelOrder(user?.role, order.status);

  const sourceLabel = order.creator
    ? `Staff (${order.creator.name})`
    : "QR Customer";

  // Formatted Dates
  const orderTime = new Date(order.createdAt).toLocaleString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const readyTimeFormatted = order.updatedAt
    ? new Date(order.updatedAt).toLocaleString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  // Helper to calculate time difference (Prep Time)
  const getPrepTime = () => {
    if (!order.createdAt || !order.updatedAt) return "N/A";
    const diffMs = new Date(order.updatedAt) - new Date(order.createdAt);
    const diffMins = Math.floor(diffMs / 60000);
    const diffSecs = Math.floor((diffMs % 60000) / 1000);
    return `${diffMins}m ${diffSecs}s`;
  };

  const statusMsg = getStatusMessaging(order.status, getPrepTime());

  const totalQty = order.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;
  const grandTotal = order.total || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity p-0 sm:p-4">
      {/* Click outside to close area */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Container Sheet Window */}
      <div className="relative flex h-[90vh] w-full flex-col bg-white shadow-2xl transition-all duration-300 sm:h-[85vh] sm:max-h-200 sm:w-200 rounded-t-2xl sm:rounded-2xl overflow-hidden">
        {/* Mobile Pull Indicator */}
        <div className="flex w-full justify-center pt-3 pb-1 sm:hidden">
          <div className="h-1 w-12 rounded-full bg-gray-300"></div>
        </div>

        {/* MODAL HEADER */}
        <div className="flex items-center justify-between border-b border-gray-100 p-4 sm:px-6 bg-white shrink-0">
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-gray-900">
                Order #{order.id}
                {/* {console.log(order)} */}
              </h2>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${STATUS_STYLES[order.status]}`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT_COLORS[order.status]}`}
                ></span>
                {order.status?.replace("_", " ")}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l18 18"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* MODAL MAIN CONTENT SCROLL AREA */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-8 bg-white">
          {/* META LOGISTICS GRID BOX */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* Meta Details List */}
            <div className="space-y-4 text-sm flex flex-col justify-center h-full">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3 text-gray-500">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                  <span>Table</span>
                </div>
                <span className="font-bold text-gray-900">
                  Table {order.tableNumber || "—"}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3 text-gray-500">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span>Source</span>
                </div>
                <span className="font-medium text-gray-900">{sourceLabel}</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3 text-gray-500">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  <span>Order Type</span>
                </div>
                <span className="font-bold text-gray-900">
                  {order.orderType === "DINE_IN" ? "Dine In" : "QR"}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3 text-gray-500">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Order Time</span>
                </div>
                <span className="font-medium text-gray-900">{orderTime}</span>
              </div>
            </div>

            {/* Right Status Banner Block */}
            <div
              className={`rounded-xl p-5 flex flex-col justify-center h-full ${STATUS_STYLES[order.status] || "bg-gray-50 text-gray-800"}`}
            >
              <p className="text-xs font-semibold text-gray-500 mb-2">
                Order Status
              </p>

              <div className="flex items-center gap-2 font-bold text-xl mb-2">
                {order.status === "READY" && (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
                <span>{order.status?.replace("_", " ")}</span>
              </div>

              {/* 3. Render the cleanly imported text values */}
              <p className="text-sm font-semibold mb-3">{statusMsg.subtitle}</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                {statusMsg.description}
              </p>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* FOOD LINE ITEMS VIEW */}
          <div>
            <h3 className="text-[15px] font-bold text-gray-900 mb-4">
              Order Items
            </h3>
            <div className="space-y-6">
              {isLoading
                ? // Skeleton
                  [...Array(3)].map((_, i) => (
                    <div key={i} className="flex gap-4 animate-pulse">
                      <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl bg-gray-100 shrink-0" />
                      <div className="flex-1 space-y-2 py-1">
                        <div className="h-4 bg-gray-100 rounded w-2/3" />
                        <div className="h-3 bg-gray-100 rounded w-1/3" />
                      </div>
                      <div className="h-4 bg-gray-100 rounded w-16" />
                    </div>
                  ))
                : order.items?.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      {/* Item Image Placeholder */}
                      <img
                        src={item.imageUrl || "https://via.placeholder.com/150"}
                        alt={item.menuName}
                        className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl object-cover border border-gray-100 bg-gray-50 shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <h4 className="text-[15px] font-bold text-gray-900 truncate">
                              {item.menuName}
                            </h4>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                              <span>
                                {formatPrice(item.price)} × {item.quantity}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2 shrink-0">
                            <span className="text-[15px] font-bold text-red-600">
                              {formatPrice(item.subtotal)}
                            </span>
                            <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-500">
                              x {item.quantity}
                            </span>
                          </div>
                        </div>

                        {/* Notes Flag */}
                        {item.note && (
                          <div className="mt-3">
                            <p className="text-xs text-gray-400 mb-1.5">
                              Note from customer
                            </p>
                            <div className="rounded-lg bg-orange-50/50 border border-orange-100 px-3 py-2.5 text-sm text-orange-500 font-medium flex items-center gap-2">
                              <svg
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                              {item.note}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* FINANCIAL SUMMARY */}
          <div>
            <h3 className="text-[15px] font-bold text-gray-900 mb-4">
              Order Summary
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Total Items</span>
                <span className="font-medium text-gray-900">
                  {totalQty} items
                </span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-[15px] font-bold text-gray-900">
                  Total Amount
                </span>
                <span className="text-lg font-bold text-red-600">
                  {formatPrice(grandTotal)}
                </span>
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* TIMELINE */}
          <div>
            <h3 className="text-[15px] font-bold text-gray-900 mb-6">
              Timeline
            </h3>
            <div className="relative border-l-2 border-gray-200 ml-3 space-y-8 pb-4 text-sm">
              {/* Order Placed */}
              <div className="relative pl-6">
                <span className="absolute -left-2.25 top-1 h-4 w-4 rounded-full bg-emerald-500 ring-4 ring-white" />
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-gray-900">Order Placed</p>
                    <p className="text-gray-500 mt-0.5">{orderTime}</p>
                  </div>
                  <span className="text-gray-500">By: {sourceLabel}</span>
                </div>
              </div>

              {/* In Progress */}
              {["IN_PROGRESS", "READY", "SERVED"].includes(order.status) && (
                <div className="relative pl-6">
                  <span className="absolute -left-2.25 top-1 h-4 w-4 rounded-full bg-blue-500 ring-4 ring-white" />
                  <div>
                    <p className="font-bold text-gray-900">In Progress</p>
                    <p className="text-gray-500 mt-0.5">
                      Kitchen started preparation
                    </p>
                  </div>
                </div>
              )}

              {/* Ready */}
              {["READY", "SERVED"].includes(order.status) && (
                <div className="relative pl-6">
                  <span className="absolute -left-2.25 top-1 h-4 w-4 rounded-full bg-emerald-500 ring-4 ring-white" />
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-gray-900">Order Ready</p>
                      <p className="text-gray-500 mt-0.5">
                        {readyTimeFormatted}
                      </p>
                    </div>
                    <span className="font-medium text-gray-500">
                      {getPrepTime()}
                    </span>
                  </div>
                </div>
              )}

              {/* Served */}
              {order.status === "SERVED" && (
                <div className="relative pl-6">
                  <span className="absolute -left-2.25 top-1 h-4 w-4 rounded-full bg-gray-400 ring-4 ring-white" />
                  <div>
                    <p className="font-bold text-gray-900">Served</p>
                    <p className="text-gray-500 mt-0.5">{readyTimeFormatted}</p>
                  </div>
                </div>
              )}

              {/* Cancelled */}
              {order.status === "CANCELLED" && (
                <div className="relative pl-6">
                  <span className="absolute -left-2.25 top-1 h-4 w-4 rounded-full bg-red-400 ring-4 ring-white" />
                  <div>
                    <p className="font-bold text-gray-900">Cancelled</p>
                    <p className="text-gray-500 mt-0.5">{readyTimeFormatted}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BOTTOM RESPONSIVE ACTION PILLS BAR - DESKTOP LAYOUT */}
        <div className="hidden border-t border-gray-100 bg-white p-5 sm:flex items-center justify-between shrink-0">
          <div>
            {canCancel && (
              <button
                disabled={updating}
                onClick={async () => {
                  setUpdating(true);
                  await onCancel(order.id);
                  setUpdating(false);
                }}
                className="rounded-xl border border-red-200 px-5 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 transition duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {updating ? "Cancelling..." : "Cancel Order"}
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            {canAdvance && (
              <button
                disabled={updating}
                onClick={async () => {
                  setUpdating(true);
                  await onStatusUpdate(order.id, nextStatus);
                  setUpdating(false);
                }}
                className="flex items-center gap-2 rounded-xl bg-red-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-red-700 transition duration-150 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {updating ? (
                  <div className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
                {updating ? "Updating..." : STATUS_BUTTON_LABEL[order.status]}
              </button>
            )}
          </div>
        </div>

        {/* BOTTOM RESPONSIVE ACTION PILLS BAR - MOBILE LAYOUT */}
        <div className="grid grid-cols-2 gap-5 border-t border-gray-100 bg-white p-4 pb-6 sm:hidden shrink-0">
          {canCancel ? (
            <button
              disabled={updating}
              onClick={async () => {
                setUpdating(true);
                await onCancel(order.id);
                setUpdating(false);
              }}
              className="flex flex-col items-center justify-center p-3 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {updating ? (
                <div className="h-6 w-6 mb-1 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
              ) : (
                <svg
                  className="h-6 w-6 mb-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l18 18"
                  />
                </svg>
              )}
              <span className="text-[11px] font-bold">
                {updating ? "..." : "Cancel"}
              </span>
            </button>
          ) : (
            <div className="flex flex-col items-center justify-center p-3 rounded-xl border border-gray-100 text-gray-300 bg-gray-50 cursor-not-allowed">
              <svg
                className="h-6 w-6 mb-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l18 18"
                />
              </svg>
              <span className="text-[11px] font-bold">Cancel</span>
            </div>
          )}

          {canAdvance ? (
            <button
              disabled={updating}
              onClick={async () => {
                setUpdating(true);
                await onStatusUpdate(order.id, nextStatus);
                setUpdating(false);
              }}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-red-600 text-white shadow-sm hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {updating ? (
                <div className="h-6 w-6 mb-1 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <svg
                  className="h-6 w-6 mb-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
              <span className="text-[11px] font-bold text-center leading-tight">
                {updating
                  ? "..."
                  : order.status === "PENDING"
                    ? "Prepare"
                    : "Mark\nServed"}
              </span>
            </button>
          ) : (
            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-gray-100 text-gray-400 cursor-not-allowed">
              <svg
                className="h-6 w-6 mb-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-[11px] font-bold">Done</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
