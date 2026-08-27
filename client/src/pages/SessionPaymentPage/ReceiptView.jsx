import { useSettings } from "../../contexts/SettingsContext";
import { roundKhrCash } from "../../utils/currency";

const ReceiptView = ({ session, orders, runningTotal, payment }) => {
  // const { formatPrice } = useSettings();
  const { formatPrice, currency, exchangeRate } = useSettings();
  const isPaid = !!payment;
  const isKhr = payment?.paymentCurrency === "KHR";
  const displayCashReceived = payment?.cashReceived;
  const displayChange = payment?.changeAmount;

  const formatRaw = (amount) => {
    if (isKhr) {
      return `${Math.round(Number(amount || 0)).toLocaleString()} រៀល`;
    }
    return `$${parseFloat(amount || 0).toFixed(2)}`;
  };

  const formatHistoricalTotal = (amount) => {
    const num = Number(amount || 0);

    if (isKhr) {
      return `${roundKhrCash(num * paymentExchangeRate).toLocaleString()} រៀល`;
    }

    return `$${num.toFixed(2)}`;
  };

  const displayTotal =
    currency === "KHR"
      ? roundKhrCash(runningTotal * exchangeRate)
      : runningTotal;

  const paymentExchangeRate = Number(payment?.exchangeRate || exchangeRate);

  const formatHistoricalPrice = (amount) => {
    const num = Number(amount || 0);

    if (isKhr) {
      return `${Math.round(num * paymentExchangeRate).toLocaleString()} រៀល`;
    }

    return `$${num.toFixed(2)}`;
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden mb-4 print-receipt">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
        <p className="text-sm font-bold text-gray-900">
          Table {session?.table?.table_number ?? "—"}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {new Date(session.openedAt).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })}
        </p>
      </div>

      {/* Orders and items */}
      <div className="divide-y divide-gray-100">
        {orders.map((order, index) => (
          <div key={order.id} className="px-5 py-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-bold text-gray-900">
                Order #{index + 1}
              </p>
              <span className="text-sm font-medium text-gray-600">
                {isPaid
                  ? formatHistoricalPrice(order.total)
                  : formatPrice(order.total)}
              </span>
            </div>

            <div className="space-y-1.5">
              {order.items.map((item, idx) => (
                <div
                  key={`${item.menuName}-${idx}`}
                  className="flex justify-between text-sm text-gray-500"
                >
                  <span>
                    {item.menuName}{" "}
                    <span className="text-gray-400 mx-1">×</span>{" "}
                    {item.quantity}
                  </span>

                  <span>
                    {isPaid
                      ? formatHistoricalPrice(item.price * item.quantity)
                      : formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="flex justify-between items-center px-5 py-4 border-t border-gray-100 bg-gray-50/50">
        <span className="text-base font-bold text-gray-900">Total</span>
        <span className="text-lg font-bold text-brand">
          {isPaid
            ? formatHistoricalTotal(runningTotal)
            : currency === "KHR"
              ? `${displayTotal.toLocaleString()} រៀល`
              : formatPrice(runningTotal)}
        </span>
      </div>

      {/* Payment section — only shown after payment confirmed */}
      {isPaid && (
        <div className="px-5 py-4 border-t border-gray-100 space-y-2 bg-white">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 font-medium">Payment method</span>
            <span className="text-gray-900 font-bold">{payment.method}</span>
          </div>
          {payment.method === "CASH" && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Cash Received</span>
                <span className="text-gray-900 font-bold">
                  {formatRaw(displayCashReceived)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Change</span>
                <span className="font-bold text-brand">
                  {formatRaw(displayChange)}
                </span>
              </div>
            </>
          )}
          <div className="flex justify-between text-xs text-gray-400 pt-2 mt-2 border-t border-gray-50">
            <span>Processed by</span>
            <span>{payment.processor?.name ?? "—"}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceiptView;
