import {
  ArrowLeft,
  Printer,
  Banknote,
  QrCode,
  CheckCircle2,
  CheckCircle,
} from "lucide-react";
import ReceiptView from "./ReceiptView";

const METHODS = [
  { id: "CASH", label: "Cash", icon: Banknote },
  { id: "KHQR", label: "KHQR", icon: QrCode },
];

const CURRENCIES = [
  { id: "USD", label: "USD", symbol: "$" },
  { id: "KHR", label: "KHR", symbol: "៛" },
];

const CheckoutForm = ({
  session,
  orders,
  runningTotal,
  displayTotal,
  method,
  setMethod,
  cashReceived,
  setCashReceived,
  change,
  isCashSufficient,
  canSubmit,
  loading,
  error,
  settings,
  onConfirm,
  onPrintBill,
  onBack,
  currency,
  setCurrency,
}) => {
  const { formatPrice, formatByCurrency, khqrImageUrl } = settings;

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto w-full">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to session
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Table {session?.table?.table_number} • Checkout
        </h1>
        <p className="text-sm text-gray-500">
          {orders.length} order{orders.length !== 1 ? "s" : ""} • Session total
        </p>
      </div>

      <ReceiptView
        session={session}
        orders={orders}
        runningTotal={runningTotal}
        payment={null}
      />

      <button
        onClick={onPrintBill}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors bg-white shadow-sm mb-8 mt-4"
      >
        <Printer className="w-4 h-4" />
        Print Bill
      </button>

      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Payment Method
        </p>
        <div className="flex gap-3">
          {METHODS.map((m) => {
            const Icon = m.icon;
            const isActive = method === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setMethod(m.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                  isActive
                    ? "border-brand text-brand bg-[#fce8e8] shadow-sm"
                    : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 bg-white"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${isActive ? "text-brand" : "text-gray-400"}`}
                />
                {m.label}
              </button>
            );
          })}
        </div>
      </div>

      {method === "KHQR" && khqrImageUrl && (
        <div className="mb-6 flex flex-col items-center gap-3 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            Scan to pay
          </p>
          <img
            src={khqrImageUrl}
            alt="KHQR Code"
            className="w-48 h-48 object-contain rounded-lg border border-gray-100 p-2"
          />
        </div>
      )}

      {method === "CASH" && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Currency
          </p>
          <div className="flex gap-3">
            {CURRENCIES.map((c) => {
              const isActive = currency === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setCurrency(c.id)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                    isActive
                      ? "border-brand text-brand bg-[#fce8e8] shadow-sm"
                      : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 bg-white"
                  }`}
                >
                  {c.symbol} {c.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {method === "CASH" && (
        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Cash Received
          </p>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Banknote className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              value={cashReceived}
              onChange={(e) => setCashReceived(e.target.value)}
              placeholder={`Min ${formatByCurrency(displayTotal, currency)}`}
              className="w-full pl-11 pr-4 py-3 rounded-xl border bg-input border-gray-200 text-gray-900 text-base font-medium focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all shadow-sm"
            />
          </div>

          <div className="mt-2 min-h-5">
            {change !== null && change >= 0 && (
              <p
                className="text-sm font-medium"
                style={{ color: "var(--color-brand)" }}
              >
                Change: {formatByCurrency(change, currency)}
              </p>
            )}
            {change !== null && change < 0 && (
              <p className="text-sm font-medium text-red-500">
                Insufficient amount
              </p>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="p-3 mb-4 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-100">
          {error}
        </div>
      )}

      <button
        onClick={onConfirm}
        disabled={!canSubmit || loading}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ background: "var(--color-brand)", color: "#ffffff" }}
      >
        <CheckCircle className="w-4 h-4" />
        {loading
          ? "Processing..."
          : `Confirm Payment • ${
              method === "CASH"
                ? formatByCurrency(displayTotal, currency)
                : formatPrice(runningTotal)
            }`}
      </button>

      {method === "CASH" && isCashSufficient && (
        <div className="mt-4 p-4 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0] flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-green-900">
              Ready to complete payment
            </p>
            <p className="text-xs text-green-700 mt-0.5">
              Amount received matches the total.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutForm;
