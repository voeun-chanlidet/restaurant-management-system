import { useState, useEffect } from "react";
import OrderService from "../../services/order";
import OrderList from "./OrderList";
import OrderDetailModal from "./OrderDetailModal";
import TableSelector from "./TableSelector";
import MenuSelector from "./MenuSelector";
import OrderSummary from "./OrderSummary";

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // New order flow — tracks which step we're on
  const [step, setStep] = useState(null); // null | "table" | "menu" | "summary"
  const [selectedTable, setSelectedTable] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  const fetchOrders = async () => {
    try {
      const data = await OrderService.getAllOrders();
      setOrders(data.orders);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Detail modal
  const openDetail = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const closeDetail = () => {
    setSelectedOrder(null);
    setShowDetailModal(false);
  };

  // New order flow handlers
  const startNewOrder = () => setStep("table");

  const handleTableSelect = (table) => {
    setSelectedTable(table);
    setStep("menu");
  };

  const handleCartConfirm = (items) => {
    setCartItems(items);
    setStep("summary");
  };

  const handleOrderSubmit = async (orderData) => {
    try {
      await OrderService.createOrder(orderData);
      await fetchOrders();
      // Reset flow
      setStep(null);
      setSelectedTable(null);
      setCartItems([]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancelFlow = () => {
    setStep(null);
    setSelectedTable(null);
    setCartItems([]);
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await OrderService.updateOrderStatus(id, status);
      await fetchOrders();
      closeDetail();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancelOrder = async (id) => {
    try {
      await OrderService.cancelOrder(id);
      await fetchOrders();
      closeDetail();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-heading)]">
          Orders
        </h1>
        {!step && (
          <button
            onClick={startNewOrder}
            className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-black font-semibold px-4 py-2 rounded-lg"
          >
            + New Order
          </button>
        )}
      </div>

      {/* New order flow */}
      {step === "table" && (
        <TableSelector
          onSelect={handleTableSelect}
          onCancel={handleCancelFlow}
        />
      )}
      {step === "menu" && (
        <MenuSelector
          table={selectedTable}
          onConfirm={handleCartConfirm}
          onCancel={handleCancelFlow}
        />
      )}
      {step === "summary" && (
        <OrderSummary
          table={selectedTable}
          items={cartItems}
          onSubmit={handleOrderSubmit}
          onBack={() => setStep("menu")}
          onCancel={handleCancelFlow}
        />
      )}

      {/* Order list — always visible when not in flow */}
      {!step && <OrderList orders={orders} onCardClick={openDetail} />}

      {/* Detail modal */}
      {showDetailModal && selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={closeDetail}
          onStatusUpdate={handleStatusUpdate}
          onCancel={handleCancelOrder}
        />
      )}
    </div>
  );
};

export default OrderPage;
