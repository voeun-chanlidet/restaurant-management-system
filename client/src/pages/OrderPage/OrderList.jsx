import OrderCard from "./OrderCard";

const OrderList = ({ orders, onCardClick }) => {
  if (orders.length === 0) {
    return (
      <div className="text-center mt-16 text-dimmed">
        <p className="text-sm">No orders found.</p>
        <p className="text-xs mt-1">
          Orders will appear here when created from Dining or QR ordering.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} onClick={onCardClick} />
      ))}
    </div>
  );
};

export default OrderList;
