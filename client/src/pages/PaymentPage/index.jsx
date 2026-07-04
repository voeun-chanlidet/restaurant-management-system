import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import OrderService from "../../services/order";
import PaymentService from "../../services/payment";
import PaymentList from "./PaymentList";
import PaymentHistory from "./PaymentHistory";
import PaymentDetailModal from "./PaymentDetailModal";
import toast from "react-hot-toast";

const PaymentPage = () => {
  const { user, loading } = useAuth();
  const [unpaidSessions, setUnpaidSessions] = useState([]);
  const [allPayments, setAllPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showPaymentDetail, setShowPaymentDetail] = useState(false);

  const fetchUnpaidOrders = useCallback(async () => {
    try {
      const data = await OrderService.getUnpaidServedOrders();
      setUnpaidSessions(data);
    } catch (error) {
      toast.error("Failed to load unpaid orders.");
    }
  }, []);

  const fetchAllPayments = useCallback(async () => {
    try {
      const data = await PaymentService.getAllPayments();
      setAllPayments(data.payments);
    } catch (error) {
      toast.error("Failed to load payment history.");
    }
  }, []);

  useEffect(() => {
    if (loading) return;
    fetchUnpaidOrders();
    if (user?.role === "ADMIN") fetchAllPayments();
  }, [loading, user?.role, fetchUnpaidOrders, fetchAllPayments]);

  const openPaymentDetail = (payment) => {
    setSelectedPayment(payment);
    setShowPaymentDetail(true);
  };

  const closePaymentDetail = () => {
    setSelectedPayment(null);
    setShowPaymentDetail(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-heading mb-6">Payments</h1>

      <div className="mb-8">
        <h2 className="text-dimmed text-xs uppercase tracking-wider mb-3">
          Awaiting Payment
        </h2>
        <PaymentList sessions={unpaidSessions} />
      </div>

      {user?.role === "ADMIN" && (
        <div>
          <h2 className="text-dimmed text-xs uppercase tracking-wider mb-3">
            Payment History
          </h2>
          <PaymentHistory
            payments={allPayments}
            onCardClick={openPaymentDetail}
          />
        </div>
      )}

      {showPaymentDetail && selectedPayment && (
        <PaymentDetailModal
          payment={selectedPayment}
          onClose={closePaymentDetail}
        />
      )}
    </div>
  );
};

export default PaymentPage;
