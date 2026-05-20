import PaymentCard from "./PaymentCard";

const PaymentList = ({ orders, onCardClick }) => {
  if (orders.length === 0) {
    return (
      <p className="text-[var(--color-dimmed)] text-sm">
        No orders awaiting payment.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {orders.map((order) => (
        <PaymentCard key={order.id} order={order} onClick={onCardClick} />
      ))}
    </div>
  );
};

export default PaymentList;
