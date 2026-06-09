import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PaymentService from "../../services/payment";
import api from "../../services/api";

const METHODS = ["CASH", "CARD", "KHQR"];

// ─── Receipt View ────────────────────────────────────────────────────────────
// Shared layout used in both bill (pre-payment) and receipt (post-payment).
// When `payment` is null → bill view. When payment exists → full receipt.
const ReceiptView = ({ session, orders, runningTotal, payment }) => {
  const isPaid = !!payment;

  return (
    <div
      className="rounded-xl border overflow-hidden mb-6 print-receipt"
      style={{ borderColor: "var(--color-panel-border)" }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 border-b"
        style={{ borderColor: "var(--color-panel-border)" }}
      >
        <p className="text-sm font-semibold text-heading">
          Table {session?.table?.table_number ?? "—"}
        </p>
        <p className="text-xs text-dimmed">
          {new Date(session.openedAt).toLocaleString()}
        </p>
      </div>

      {/* Orders and items */}
      {orders.map((order, index) => (
        <div
          key={order.id}
          className="px-4 py-3"
          style={{
            borderBottom: "1px solid var(--color-panel-border)",
          }}
        >
          <div className="flex justify-between items-center mb-1">
            <p className="text-sm font-medium text-heading">
              Order #{index + 1}
            </p>
            <span className="text-sm text-dimmed">
              ${parseFloat(order.total).toFixed(2)}
            </span>
          </div>
          {order.items.map((item) => (
            <div
              key={item.menuName}
              className="flex justify-between text-xs text-dimmed"
            >
              <span>
                {item.menuName} x{item.quantity}
              </span>
              <span>${parseFloat(item.subtotal).toFixed(2)}</span>
            </div>
          ))}
        </div>
      ))}

      {/* Total */}
      <div
        className="flex justify-between items-center px-4 py-3"
        style={{
          borderTop: "1px solid var(--color-panel-border)",
          background: "var(--color-input)",
        }}
      >
        <span className="text-sm font-bold text-heading">Total</span>
        <span
          className="text-lg font-bold"
          style={{ color: "var(--color-brand)" }}
        >
          ${runningTotal.toFixed(2)}
        </span>
      </div>

      {/* Payment section — only shown after payment confirmed */}
      {isPaid && (
        <div
          className="px-4 py-3 space-y-1.5"
          style={{ borderTop: "1px solid var(--color-panel-border)" }}
        >
          <div className="flex justify-between text-sm">
            <span className="text-dimmed">Payment method</span>
            <span className="text-heading">{payment.method}</span>
          </div>
          {payment.method === "CASH" && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-dimmed">Amount tendered</span>
                <span className="text-heading">
                  ${parseFloat(payment.amountTendered).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-dimmed">Change</span>
                <span style={{ color: "var(--color-brand)" }}>
                  ${parseFloat(payment.change).toFixed(2)}
                </span>
              </div>
            </>
          )}
          <div className="flex justify-between text-xs text-dimmed pt-1">
            <span>Processed by</span>
            <span>{payment.processor?.name ?? "—"}</span>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Main Page ───────────────────────────────────────────────────────────────
const SessionPaymentPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const session = state?.session;
  const orders = state?.orders || [];
  const runningTotal = state?.runningTotal || 0;

  const [method, setMethod] = useState("CASH");
  const [amountTendered, setAmountTendered] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // When this is set, we switch to the paid view
  const [payment, setPayment] = useState(null);

  if (!session) {
    navigate("/dining");
    return null;
  }

  const change =
    method === "CASH" && amountTendered
      ? parseFloat(amountTendered) - runningTotal
      : null;

  const canSubmit =
    method !== "CASH" ||
    (amountTendered && parseFloat(amountTendered) >= runningTotal);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await PaymentService.createPayment({
        sessionId: session.id,
        method,
        amountTendered: method === "CASH" ? parseFloat(amountTendered) : null,
      });
      // Store payment result — this triggers the paid view
      setPayment(result.payment);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReceipt = async () => {
    try {
      const response = await api.get(`/payments/${payment.id}/receipt`, {
        responseType: "blob", // tells Axios to treat the response as binary data
      });

      // Create a temporary URL pointing to the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Create a hidden link and click it to trigger download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `receipt-${payment.id}.pdf`);
      document.body.appendChild(link);
      link.click();

      // Clean up
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download receipt", err);
    }
  };

  const handlePrintBill = () => window.print();

  // ── Paid state ──────────────────────────────────────────────────────────
  if (payment) {
    const paidOrders = payment.session?.orders || orders;
    const total = parseFloat(payment.totalAmount);

    return (
      <div className="p-6 md:p-8 max-w-2xl mx-auto">
        {/* Success header */}
        <div className="mb-8">
          <div
            className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full mb-4"
            style={{
              background: "var(--color-brand)/15",
              color: "var(--color-brand)",
            }}
          >
            ✓ Payment confirmed
          </div>
          <h1 className="text-2xl font-semibold text-heading mb-1">
            Table {session?.table?.table_number ?? "—"} · Receipt
          </h1>
          <p className="text-xs text-dimmed">
            #{payment.id} · {new Date(payment.createdAt).toLocaleString()}
          </p>
        </div>

        {/* Receipt — same component, now with payment data */}
        <ReceiptView
          session={payment.session ?? session}
          orders={paidOrders}
          runningTotal={total}
          payment={payment}
        />

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handlePrintBill}
            className="flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors"
            style={{
              borderColor: "var(--color-panel-border)",
              color: "var(--color-dimmed)",
            }}
          >
            Print Receipt
          </button>
          <button
            onClick={handleDownloadReceipt}
            className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors"
            style={{
              background: "var(--color-brand)",
              color: "#0e0e0e",
            }}
          >
            Download PDF
          </button>
        </div>

        <button
          onClick={() => navigate("/dining")}
          className="w-full mt-3 py-2.5 rounded-lg text-sm text-dimmed hover:text-heading transition-colors"
        >
          Back to floor
        </button>
      </div>
    );
  }

  // ── Unpaid state (your existing UI, unchanged) ───────────────────────────
  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm font-medium text-dimmed hover:text-heading transition-colors mb-6"
      >
        ← Back to session
      </button>

      <h1 className="text-2xl font-semibold text-heading mb-1">
        Table {session?.table?.table_number} · Checkout
      </h1>
      <p className="text-xs text-dimmed mb-8">
        {orders.length} order{orders.length !== 1 ? "s" : ""} · Session total
      </p>

      {/* Bill — same component, no payment data yet */}
      <ReceiptView
        session={session}
        orders={orders}
        runningTotal={runningTotal}
        payment={null}
      />

      {/* Print bill button — before payment */}
      <button
        onClick={handlePrintBill}
        className="w-full py-2.5 rounded-lg text-sm font-medium border mb-6 transition-colors"
        style={{
          borderColor: "var(--color-panel-border)",
          color: "var(--color-dimmed)",
        }}
      >
        Print Bill
      </button>

      {/* Payment method */}
      <p className="text-xs text-dimmed uppercase tracking-wider mb-3">
        Payment Method
      </p>
      <div className="flex gap-2 mb-6">
        {METHODS.map((m) => (
          <button
            key={m}
            onClick={() => setMethod(m)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
              method === m
                ? "border-brand text-brand bg-brand/10"
                : "border-panel-border text-dimmed hover:border-faint"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Cash input */}
      {method === "CASH" && (
        <div className="mb-6">
          <p className="text-xs text-dimmed uppercase tracking-wider mb-2">
            Amount Tendered
          </p>
          <input
            type="number"
            value={amountTendered}
            onChange={(e) => setAmountTendered(e.target.value)}
            placeholder={`Min $${runningTotal.toFixed(2)}`}
            className="w-full px-4 py-2 rounded-lg border text-heading text-sm"
            style={{
              borderColor: "var(--color-panel-border)",
              background: "var(--color-input)",
            }}
          />
          {change !== null && change >= 0 && (
            <p className="text-sm mt-2" style={{ color: "var(--color-brand)" }}>
              Change: ${change.toFixed(2)}
            </p>
          )}
          {change !== null && change < 0 && (
            <p className="text-sm mt-2 text-red-500">Insufficient amount</p>
          )}
        </div>
      )}

      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

      <button
        onClick={handleConfirm}
        disabled={!canSubmit || loading}
        className="w-full py-3 rounded-lg text-sm font-semibold transition-all disabled:opacity-40"
        style={{ background: "var(--color-brand)", color: "#0e0e0e" }}
      >
        {loading
          ? "Processing..."
          : `Confirm Payment · $${runningTotal.toFixed(2)}`}
      </button>
    </div>
  );
};

export default SessionPaymentPage;
