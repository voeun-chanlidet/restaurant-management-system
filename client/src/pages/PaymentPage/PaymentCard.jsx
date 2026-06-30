import { useNavigate } from "react-router-dom";
import { useSettings } from "../../contexts/SettingsContext";

const PaymentCard = ({ session }) => {
  const { formatPrice } = useSettings();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/dining/payment", {
      state: {
        session: {
          id: session.id,
          openedAt: session.openedAt,
          table: { table_number: session.tableNumber },
        },
        orders: session.orders,
        runningTotal: session.runningTotal,
      },
    });
  };

  // Derive counts for the summary footer
  const totalItems = session.allItems?.length || 0;
  const totalOrders = session.orders?.length || 0;

  return (
    <div
      onClick={handleClick}
      className="bg-white border border-gray-100 rounded-xl p-4 cursor-pointer hover:shadow-md hover:border-gray-200 transition-all flex flex-col h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-900 font-bold text-sm">
          Table {session.tableNumber ?? "—"}{" "}
        </span>
        <span className="text-[10px] px-2 py-1 rounded font-bold bg-orange-50 text-orange-500 uppercase tracking-wide">
          UNPAID
        </span>
      </div>

      {/* Items preview */}
      <div className="mb-4 space-y-2 flex-1">
        {session.allItems?.slice(0, 3).map((item, index) => (
          <div
            key={index}
            className="flex justify-between text-sm text-gray-500"
          >
            <span>
              {item.menuName}{" "}
              <span className="text-gray-400 ml-1">x{item.quantity}</span>
            </span>
            <span>{formatPrice(item.subtotal)}</span>
          </div>
        ))}
        {totalItems > 3 && (
          <p className="text-sm text-gray-400 italic">
            +{totalItems - 3} more item{totalItems - 3 !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* Footer Stats */}
      <div className="flex items-center justify-between pt-2 mt-auto">
        <span className="text-xs text-gray-500 font-medium">
          {totalOrders} order{totalOrders !== 1 && "s"} · {totalItems} item
          {totalItems !== 1 && "s"}
        </span>
        <span className="text-sm font-bold text-red-600">
          {formatPrice(session.runningTotal)}
        </span>
      </div>

      {/* Pay Now Button */}
      <div className="mt-4 w-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors py-2.5 rounded-lg flex items-center justify-center text-sm font-bold gap-2">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
          <line x1="1" y1="10" x2="23" y2="10"></line>
        </svg>
        Pay Now
      </div>
    </div>
  );
};

export default PaymentCard;
