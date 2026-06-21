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

  return (
    <div
      onClick={handleClick}
      className="bg-panel border border-panel-border rounded-xl p-4 cursor-pointer hover:brightness-110 transition"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-heading font-semibold text-sm">
          Table {session.tableNumber ?? "—"}
        </span>
        <span className="text-xs px-2 py-1 rounded-full font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
          UNPAID
        </span>
      </div>

      {/* Items preview */}
      <div className="mb-3 space-y-1">
        {session.allItems.slice(0, 3).map((item, index) => (
          <div key={index} className="flex justify-between text-xs text-dimmed">
            <span>
              {item.menuName} x{item.quantity}
            </span>
            <span>{formatPrice(item.subtotal)}</span>
          </div>
        ))}
        {session.allItems.length > 3 && (
          <p className="text-xs text-dimmed">
            +{session.allItems.length - 3} more items
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-panel-border pt-3">
        <span className="text-xs text-dimmed">
          {session.orders.length} order{session.orders.length !== 1 && "s"}
        </span>
        <span className="text-sm font-semibold text-brand">
          {formatPrice(session.runningTotal)}
        </span>
      </div>
    </div>
  );
};

export default PaymentCard;
