import { STATUS_STYLES, CARD_BORDER_COLORS } from "../../utils/orderStatus";
import { useSettings } from "../../contexts/SettingsContext";

const OrderCard = ({ order, index, onClick }) => {
  const { formatPrice } = useSettings();
  const cardBorderClass = CARD_BORDER_COLORS[order.status] || "border-gray-200";

  return (
    <div
      onClick={onClick}
      className={`rounded-xl border bg-white flex flex-col ${cardBorderClass} shadow-sm cursor-pointer`}
    >
      <div className="p-5 flex-1">
        {/* Order Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="text-sm font-bold text-gray-900">
              Order #{index + 1}
            </p>
            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
              by {order.creator?.name || "Admin"}
              {/* Optional: Add origin icon like 'via QR' if present in data */}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <span
              className={`text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wider uppercase ${
                STATUS_STYLES[order.status] || "bg-gray-100 text-gray-600"
              }`}
            >
              {order.status ? order.status.replace("_", " ") : "UNKNOWN"}
            </span>
          </div>
        </div>

        {/* Item List */}
        <div className="flex flex-col gap-4">
          {order.items?.map((item, i) => (
            <div key={i} className="flex justify-between items-start text-sm">
              <div className="flex flex-col">
                <span className="text-gray-900 font-semibold">
                  {item.menuName}
                </span>
                {/* Note display mapped from image logic */}
                {item.note && (
                  <span className="text-xs text-gray-400 mt-0.5">
                    Note: {item.note}
                  </span>
                )}
              </div>
              <div className="flex gap-4 text-gray-600 font-medium">
                <span>x{item.quantity}</span>
                <span className="w-12 text-right">
                  {formatPrice(item.subtotal || 0)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Cancellation Notice inside body */}
        {order.status === "CANCELLED" && order.updatedAt && (
          <div className="mt-6 text-xs text-rose-500 font-medium">
            Cancelled on{" "}
            {new Date(order.updatedAt).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </div>
        )}
      </div>

      {/* Order Footer Total */}
      <div className="flex justify-between items-center text-sm font-bold text-gray-900 bg-gray-50/50 p-5 rounded-b-xl border-t border-gray-100">
        <span>Order total</span>
        <span> {formatPrice(order.total || 0)}</span>
      </div>
    </div>
  );
};

export default OrderCard;
