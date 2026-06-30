import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PaymentService from "../../services/payment";
import api from "../../services/api";
import { useSettings } from "../../contexts/SettingsContext";
import PaymentSuccess from "./PaymentSuccess";
import CheckoutForm from "./CheckoutForm";
import PrintableBill from "./PrintableBill";
import toast from "react-hot-toast";

const SessionPaymentPage = () => {
  const { state } = useLocation();
  const settings = useSettings();
  const navigate = useNavigate();

  const session = state?.session;
  const orders = state?.orders || [];
  const runningTotal = state?.runningTotal || 0;

  const [method, setMethod] = useState("CASH");
  const [cashReceived, setCashReceived] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [payment, setPayment] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (!session) return;

    const checkExistingPayment = async () => {
      try {
        const result = await PaymentService.getPaymentBySession({
          sessionId: session.id,
        });
        if (result.payment) {
          toast.error("This session has already been paid.");
          navigate("/dining");
        }
      } catch (err) {}
    };

    checkExistingPayment();
  }, [session]);

  if (!session) {
    navigate("/dining");
    return null;
  }

  const displayTotal =
    settings.currency === "KHR"
      ? Math.round(runningTotal * settings.exchangeRate)
      : runningTotal;
  const change =
    method === "CASH" && cashReceived
      ? parseFloat(cashReceived) - displayTotal
      : null;
  const isCashSufficient =
    cashReceived && parseFloat(cashReceived) >= displayTotal;
  const canSubmit = method !== "CASH" || isCashSufficient;

  const handleConfirm = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await PaymentService.createPayment({
        sessionId: session.id,
        method,
        cashReceived: method === "CASH" ? parseFloat(cashReceived) : null,
        currency: settings.currency,
        exchangeRate: settings.exchangeRate,
      });
      setPayment(result.payment);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReceipt = async () => {
    try {
      setDownloading(true);
      const response = await api.get(`/payments/${payment.id}/receipt`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `receipt-${payment.id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download receipt", err);
    } finally {
      setDownloading(false);
    }
  };
  if (showPreview) {
    return (
      <div className="min-h-screen bg-gray-100 py-10 ">
        <PrintableBill
          session={session}
          orders={orders}
          runningTotal={runningTotal}
          settings={settings}
          formatPrice={settings.formatPrice}
          method={method}
        />
        <div className="print:hidden max-w-[80mm] mx-auto mt-5 grid grid-cols-2 gap-3 px-1">
          {/* Back to Checkout Button */}
          <button
            onClick={() => setShowPreview(false)}
            className="flex items-center justify-center gap-2 px-3 py-2.5 bg-white border border-gray-300 text-gray-500 font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm hover:bg-gray-50 hover:text-gray-800 hover:border-gray-400 active:scale-[0.98] transition-all duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-3.5 h-3.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
            Back to Checkout
          </button>

          {/* Print Receipt Button */}
          <button
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 px-3 py-2.5 bg-red-50 border border-red-200 text-red-600 font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-sm hover:bg-red-100 hover:text-red-700 active:scale-[0.98] transition-all duration-200 whitespace-normal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-3.5 h-3.5 shrink-0"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 1.252a1.125 1.125 0 0 1-1.107 1.323H7.218a1.125 1.125 0 0 1-1.107-1.323L6.34 18m11.32 0h-11.32M9 10.5h.008v.008H9V10.5Zm3 0h.008v.008H12V10.5Zm3 0h.008v.008H15V10.5M12 3v3.375c0 .621.504 1.125 1.125 1.125h3.625M18 3v18M6 3v18"
              />
            </svg>
            Print Receipt
          </button>
        </div>
      </div>
    );
  }

  if (payment) {
    return (
      <PaymentSuccess
        payment={payment}
        session={session}
        orders={orders}
        downloading={downloading}
        onDownloadReceipt={handleDownloadReceipt}
        onBackToFloor={() => navigate("/dining")}
        settings={settings}
      />
    );
  }

  return (
    <>
      <CheckoutForm
        session={session}
        orders={orders}
        runningTotal={runningTotal}
        method={method}
        setMethod={setMethod}
        cashReceived={cashReceived}
        setCashReceived={setCashReceived}
        change={change}
        isCashSufficient={isCashSufficient}
        canSubmit={canSubmit}
        loading={loading}
        error={error}
        settings={settings}
        onConfirm={handleConfirm}
        onPrintBill={() => setShowPreview(true)}
        onBack={() => navigate(-1)}
      />
    </>
  );
};

export default SessionPaymentPage;
