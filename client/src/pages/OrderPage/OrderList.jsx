import OrderCard from "./OrderCard";

const OrderList = ({ orders, onCardClick }) => {
  if (orders.length === 0) {
    return (
      <p className="text-[var(--color-dimmed)] text-center mt-12">
        No orders yet. Create one to get started.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} onClick={onCardClick} />
      ))}
    </div>
  );
};

export default OrderList;
