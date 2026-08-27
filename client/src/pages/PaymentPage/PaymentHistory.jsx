import { useSettings } from "../../contexts/SettingsContext";
import { QrCode, DollarSign } from "lucide-react";

const METHOD_STYLES = {
  CASH: "bg-faint text-dimmed border border-panel-border",
  KHQR: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
};

const PaymentHistory = ({ payments, onCardClick }) => {
  const { formatPrice, formatByCurrency } = useSettings();

  if (payments.length === 0) {
    return <p className="text-dimmed text-sm">No payments recorded yet.</p>;
  }

  return (
    <div className="space-y-3 cursor-pointer">
      {payments.map((payment) => {
        const cashReceived = payment.cashReceived;
        const change = payment.changeAmount;

        return (
          <div
            key={payment.id}
            onClick={() => onCardClick(payment)}
            className="bg-panel border border-panel-border rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between hover:brightness-110 transition gap-4"
          >
            {/* Left: Icon & Primary Info */}
            <div className="flex items-center gap-4 md:w-1/4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  payment.method === "KHQR"
                    ? "bg-blue-500/10 text-blue-400"
                    : "bg-green-500/10 text-green-400"
                }`}
              >
                {payment.method === "KHQR" ? (
                  <QrCode size={20} />
                ) : (
                  <DollarSign size={20} />
                )}
              </div>
              <div>
                <p className="text-heading font-semibold text-sm">
                  Table {payment.session?.table?.table_number ?? "—"}
                </p>
                <p className="text-dimmed text-xs mt-0.5">
                  {payment.session?.orders?.length} order(s) · by{" "}
                  {payment.processor?.name || "Admin"}
                </p>
                <p className="text-dimmed text-xs mt-0.5 md:hidden">
                  {new Date(payment.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Middle: Desktop Stats */}
            <div className="hidden md:flex items-center justify-between flex-1 px-4">
              <div className="flex-1">
                <p className="text-dimmed text-xs mb-1">Payment Method</p>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${METHOD_STYLES[payment.method]}`}
                >
                  {payment.method}
                </span>
              </div>

              {payment.method === "CASH" ? (
                <>
                  <div className="flex-1">
                    <p className="text-dimmed text-xs mb-1">Cash Received</p>
                    <p className="text-heading text-sm font-medium">
                      {formatByCurrency(cashReceived, payment.paymentCurrency)}
                    </p>
                  </div>
                  <div className="flex-1">
                    <p className="text-dimmed text-xs mb-1">Change</p>
                    <p className="text-green-400 text-sm font-medium">
                      {/* +{formatPrice(parseFloat(change || 0))}+ */}+{" "}
                      {formatByCurrency(change, payment.changeCurrency)}
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex-2" />
              )}
            </div>

            {/* Right: Total & Date */}
            <div className="flex items-center justify-between md:justify-end gap-6 md:w-1/4">
              <p className="text-dimmed text-xs hidden md:block w-full text-right">
                {new Date(payment.createdAt).toLocaleString()}
              </p>
              <div className="flex flex-col items-end shrink-0">
                <p className="text-dimmed text-xs mb-1 hidden md:block">
                  Total Paid
                </p>
                <p className="text-brand font-bold text-sm">
                  {formatByCurrency(payment.totalAmount, payment.totalCurrency)}
                </p>
              </div>
              <span className="text-dimmed text-lg hidden md:block">›</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PaymentHistory;
