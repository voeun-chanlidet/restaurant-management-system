import OrderCard from "./OrderCard";

const OrderList = ({ orders, onCardClick, onStatusUpdate }) => {
  if (orders.length === 0) {
    return (
      <div className="text-center mt-20 text-gray-400">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
          <svg
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <p className="text-sm font-semibold text-gray-600">No orders found.</p>
        <p className="text-xs mt-1">
          Orders will appear here when created from Dining or QR ordering.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          onClick={onCardClick}
          onStatusUpdate={onStatusUpdate}
        />
      ))}
    </div>
  );
};

export default OrderList;
