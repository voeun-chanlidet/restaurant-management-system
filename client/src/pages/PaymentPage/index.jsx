import { useState, useEffect, useContext } from "react";
import { useAuth } from "../../contexts/AuthContext";
import OrderService from "../../services/order";
import PaymentService from "../../services/payment";
import PaymentList from "./PaymentList";
import PaymentModal from "./PaymentModal";
import PaymentHistory from "./PaymentHistory";
import PaymentDetailModal from "./PaymentDetailModal";

const PaymentPage = () => {
  const { user, loading } = useAuth();
  const [unpaidOrders, setUnpaidOrders] = useState([]);
  const [allPayments, setAllPayments] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showPaymentDetail, setShowPaymentDetail] = useState(false);

  const fetchUnpaidOrders = async () => {
    try {
      const data = await OrderService.getUnpaidServedOrders();
      setUnpaidOrders(data.orders);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAllPayments = async () => {
    try {
      const data = await PaymentService.getAllPayments();
      console.log(data); // add this
      setAllPayments(data.payments);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (loading) return;
    console.log(user);
    fetchUnpaidOrders();
    if (user?.role === "ADMIN") fetchAllPayments();
  }, [loading]);

  const openModal = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setShowModal(false);
  };

  const handlePaymentSubmit = async (data) => {
    try {
      await PaymentService.createPayment(data);
      await fetchUnpaidOrders();
      if (user.role === "ADMIN") await fetchAllPayments();
      closeModal();
    } catch (error) {
      console.error(error);
    }
  };

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

      {/* Unpaid orders — both staff and admin see this */}
      <div className="mb-8">
        <h2 className="text-dimmed text-xs uppercase tracking-wider mb-3">
          Awaiting Payment
        </h2>
        <PaymentList orders={unpaidOrders} onCardClick={openModal} />
      </div>

      {/* Payment history — admin only */}
      {user.role === "ADMIN" && (
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

      {/* Payment modal */}
      {showModal && selectedOrder && (
        <PaymentModal
          order={selectedOrder}
          onClose={closeModal}
          onSubmit={handlePaymentSubmit}
        />
      )}
      {/* Payment History modal */}
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
