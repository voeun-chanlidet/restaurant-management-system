import { CheckCircle2, Printer } from "lucide-react";
import ReceiptView from "./ReceiptView";
import printReceipt from "../../utils/printReceipt";

const PaymentSuccess = ({
  payment,
  session,
  orders,
  downloading,
  onDownloadReceipt,
  onBackToFloor,
  settings,
}) => {
  const {
    formatPrice,
    restaurantName,
    address,
    phone,
    footerMessage,
    exchangeRate,
  } = settings;
  const paidOrders = (payment.session?.orders || orders).filter(
    (o) => o.status !== "CANCELLED",
  );
  const total = parseFloat(payment.totalAmount);

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto w-full">
      <div className="mb-8 flex flex-col items-center md:items-start text-center md:text-left">
        <div
          className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-1.5 rounded-full mb-4"
          style={{
            background: "var(--color-brand-light, #fce8e8)",
            color: "var(--color-brand)",
          }}
        >
          <CheckCircle2 className="w-4 h-4" /> Payment confirmed
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Table {session?.table?.table_number ?? "—"} • Receipt
        </h1>
        <p className="text-sm text-gray-500">
          #{payment.id} • {new Date(payment.createdAt).toLocaleString()}
        </p>
      </div>

      <ReceiptView
        session={payment.session ?? session}
        orders={paidOrders}
        runningTotal={total}
        payment={payment}
      />

      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <button
          onClick={() =>
            printReceipt(payment, formatPrice, {
              restaurantName,
              address,
              phone,
              footerMessage,
              exchangeRate,
            })
          }
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors bg-white shadow-sm"
        >
          <Printer className="w-4 h-4" />
          Print Receipt
        </button>
        <button
          onClick={onDownloadReceipt}
          className="flex-1 py-3 rounded-xl text-sm font-semibold transition-colors shadow-sm"
          style={{ background: "var(--color-brand)", color: "#ffffff" }}
        >
          {downloading ? "Downloading..." : "Download PDF"}
        </button>
      </div>

      <button
        onClick={onBackToFloor}
        className="w-full mt-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
      >
        Back to floor
      </button>
    </div>
  );
};

export default PaymentSuccess;
