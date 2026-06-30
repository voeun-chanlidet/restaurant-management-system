import React from "react";

const PrintableBill = ({
  orders,
  settings,
  formatPrice,
  method,
  session,
  isPaid = false,
}) => {
  // Ensure we have an array to loop through safely
  const orderBlocks = Array.isArray(orders) ? orders : [];

  // Safe extraction of metadata across different possible structures
  const receiptId = session?.id || orderBlocks[0]?.id || "162";
  const tableNum =
    session?.table?.table_number ||
    session?.tableNumber ||
    orderBlocks[0]?.tableNumber ||
    "A1";
  const serverName =
    session?.processor?.name || orderBlocks[0]?.creator?.name || "Admin";

  // Calculate running total across ALL nested order blocks dynamically if needed
  const exchangeRate = settings?.exchangeRate || 4100;
  const rawTotal = session?.totalAmount
    ? parseFloat(session.totalAmount)
    : orderBlocks.reduce((acc, order) => acc + parseFloat(order.total || 0), 0);

  const displayTotalKHR =
    rawTotal > 0
      ? `${(rawTotal * exchangeRate).toLocaleString()} រៀល`
      : "0 រៀល";

  return (
    <div className="print-receipt w-[80mm] mx-auto p-6 bg-[#faf9f6] text-black font-sans text-sm shadow-xl rounded-xl border border-gray-200 print:shadow-none print:border-none print:p-0 print:bg-white transition-all">
      {/* Brand Header Section */}
      <div className="text-center mb-5">
        {settings?.logoUrl && (
          <img
            src={settings.logoUrl}
            alt="Logo"
            className="w-16 h-16 mx-auto object-contain mb-2 rounded-full border border-gray-100 shadow-sm print:shadow-none print:border-none"
          />
        )}
        <h2 className="text-2xl font-black tracking-tight text-gray-900 uppercase whitespace-nowrap">
          {settings?.restaurantName}
        </h2>
        <p className="text-[11px] text-gray-500 font-medium mt-1 max-w-[95%] mx-auto whitespace-nowrap truncate">
          {settings?.address || "National Road 1, Yorkbat, Kbalkoh"}
        </p>
        <p className="text-[11px] text-gray-400 font-medium mt-0.5 whitespace-nowrap">
          Tel: {settings?.phone || "0965908853"}
        </p>
      </div>

      <div className="flex items-center justify-center my-4 opacity-40">
        <div className="w-full border-t border-dashed border-gray-400"></div>
      </div>

      {/* Balanced 2-Column Metadata Block */}
      <div className="grid grid-cols-2 gap-y-1 text-xs text-gray-600 mb-4 px-1 font-medium whitespace-nowrap">
        <div className="truncate">
          <span className="text-gray-400">Receipt #:</span>{" "}
          <strong className="text-gray-900">{receiptId}</strong>
        </div>
        <div className="text-right truncate">
          <span className="text-gray-400">Table:</span>{" "}
          <strong className="text-gray-900 text-sm">{tableNum}</strong>
        </div>
        <div className="truncate">
          <span className="text-gray-400">Server:</span>{" "}
          <span className="text-gray-800">${serverName}</span>
        </div>
        <div className="text-right text-[10px] text-gray-400 self-center">
          {new Date().toLocaleString()}
        </div>
      </div>

      <div className="w-full border-t-2 border-gray-900 my-3"></div>

      {/* Order Items Section - Loops through multi-order blocks flawlessly */}
      <div className="my-4 px-1">
        {orderBlocks.map((order, orderIndex) => {
          const items = order.items || [];
          return (
            <div key={order.id || orderIndex} className="mb-4 last:mb-0">
              {/* Show Order split labels only if there are multiple orders in the session */}
              {orderBlocks.length > 1 && (
                <div className="font-bold text-xs text-gray-400 uppercase tracking-wider mb-2">
                  Order #{orderIndex + 1}
                </div>
              )}

              <div className="space-y-2.5">
                {items.map((item, itemIndex) => {
                  const itemName = item.menuName || "Unknown Item";
                  const itemQuantity = item.quantity || 1;
                  const itemPriceStr = item.subtotal || item.price || "0.00";

                  const formattedItemPrice =
                    typeof formatPrice === "function"
                      ? formatPrice(parseFloat(itemPriceStr))
                      : `$${parseFloat(itemPriceStr).toFixed(2)}`;

                  return (
                    <div
                      key={item.id || itemIndex}
                      className="flex justify-between items-center text-gray-800 leading-tight gap-4 whitespace-nowrap"
                    >
                      <div className="min-w-0 flex-1 truncate">
                        <span className="font-semibold text-gray-900 truncate">
                          {itemName}
                        </span>
                        <span className="text-xs text-gray-400 ml-1.5 font-medium flex-shrink-0">
                          x{itemQuantity}
                        </span>
                      </div>
                      <span className="font-semibold text-gray-900 tabular-nums flex-shrink-0">
                        {formattedItemPrice}
                      </span>
                    </div>
                  );
                })}
              </div>

              {orderIndex < orderBlocks.length - 1 && (
                <div className="w-full border-t border-dashed border-gray-200 my-3"></div>
              )}
            </div>
          );
        })}
      </div>

      <div className="w-full border-t border-gray-300 my-4"></div>

      {/* Totals Section */}
      <div className="mt-2 px-1 whitespace-nowrap">
        <div className="flex justify-between items-baseline font-black text-xl border-b border-gray-100 pb-2">
          {/* Dynamic wording shift based on transaction status */}
          <span className="uppercase tracking-wide text-sm text-gray-900">
            {isPaid ? "Total Paid" : "Total Due"}
          </span>
          <span className="text-2xl text-gray-900 tabular-nums">
            {displayTotalKHR}
          </span>
        </div>

        <div className="bg-gray-50 rounded-lg p-2 mt-2.5 space-y-1 text-[11px] text-gray-500 font-medium print:bg-transparent print:p-0">
          <div className="flex justify-between">
            <span>Exchange Rate:</span>
            <span className="text-gray-700 font-semibold">
              (1$ = {exchangeRate} រៀល)
            </span>
          </div>
          <div className="flex justify-between">
            <span>Payment Method:</span>
            <span className="text-gray-700 font-semibold uppercase">
              {method || "CASH"}
            </span>
          </div>
        </div>
      </div>

      {/* Post-Checkout: Show Settled Badge */}
      {isPaid && (
        <div className="text-center mt-5 pt-2">
          <div className="inline-block border-2 border-dashed border-red-500 text-red-500 font-black text-xs uppercase px-4 py-1.5 rounded-lg tracking-widest rotate-[-1deg]">
            ✓ Paid via {method || "CASH"}
          </div>
        </div>
      )}

      {/* Pre-Checkout: Show KHQR Scanner space */}
      {!isPaid && method === "KHQR" && settings?.khqrImageUrl && (
        <div className="text-center mt-6 pt-5 border-t border-dashed border-gray-300">
          <p className="text-[11px] font-bold uppercase tracking-widest text-red-500 mb-2.5">
            Scan to Pay via KHQR
          </p>
          <div className="inline-block bg-white p-2 rounded-xl border border-gray-200 shadow-sm max-w-full">
            <img
              src={settings.khqrImageUrl}
              alt="KHQR Code"
              className="w-36 h-36 mx-auto object-contain"
            />
          </div>
        </div>
      )}

      {/* Footer Branding Message */}
      <div className="text-center text-xs text-gray-400 font-medium mt-6 pt-2 italic tracking-wide whitespace-nowrap truncate">
        {settings?.footerMessage || "Thank you for shopping with us!"}
      </div>
    </div>
  );
};

export default PrintableBill;
