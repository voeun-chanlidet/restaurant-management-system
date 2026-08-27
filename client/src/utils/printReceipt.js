import { roundKhrCash } from "./currency";
const printReceipt = (payment, formatPrice, settings) => {
  const {
    restaurantName,
    address,
    phone,
    footerMessage,
    exchangeRate,
    logoUrl,
  } = settings || {};

  const isKhr = payment.paymentCurrency === "KHR";
  const displayCashReceived = payment.cashReceived;
  const displayChange = payment.changeAmount;

  // Use the exchange rate stored on the payment itself if available, so
  // reprinting an old receipt stays consistent even if the restaurant's
  // live exchange rate setting has since changed. Falls back to the
  // current settings rate if the payment doesn't store its own.
  const paymentExchangeRate = payment.exchangeRate || exchangeRate;

  const formatRaw = (amount) => {
    if (isKhr) {
      return `${Math.round(Number(amount || 0)).toLocaleString()} រៀល`;
    }
    return `$${parseFloat(amount || 0).toFixed(2)}`;
  };

  // Formats a raw USD amount using the currency/rate that was in effect
  // AT THE TIME OF PAYMENT (not the restaurant's current live settings).
  // Use this for anything derived from the payment record (line items,
  // total paid) so the whole receipt stays internally consistent.
  const formatAtPaymentCurrency = (amount) => {
    const num = parseFloat(amount) || 0;
    if (isKhr) {
      return `${Math.round(num * paymentExchangeRate).toLocaleString()} រៀល`;
    }
    return `$${num.toFixed(2)}`;
  };

  const formatCashPayable = (amount) => {
    const num = parseFloat(amount) || 0;
    if (isKhr) {
      return `${roundKhrCash(num * paymentExchangeRate).toLocaleString()} รៀล`;
    }
    return `$${num.toFixed(2)}`;
  };

  const orders = payment.session?.orders || [];
  const runningTotal = Number(payment.totalAmount);

  const printWindow = window.open("", "_blank");
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Receipt #${payment.id || "—"}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&family=Kantumruy+Pro:wght@400;500;600;700;900&display=swap" rel="stylesheet">
        <style>
          @page { margin: 0; size: 80mm auto; }
          * { box-sizing: border-box; margin: 0; padding: 0; }
          
          body {
            font-family: 'Inter', 'Kantumruy Pro', sans-serif;
            background: #fff;
            padding: 24px 14px;
            color: #000;
            line-height: 1.3;
            width: 80mm;
            margin: 0 auto;
          }
          
          /* Header Styling */
          .header { text-align: center; margin-bottom: 16px; }
          .logo { width: 60px; height: 60px; object-fit: contain; margin-bottom: 6px; border-radius: 50%; }
          .shop-name { font-weight: 900; font-size: 22px; text-transform: uppercase; letter-spacing: -0.3px; margin-bottom: 4px; }
          .shop-address { font-size: 11px; color: #444; max-w: 90%; margin: 0 auto; line-height: 1.4; }
          
          /* Dividers */
          .divider-dashed { border: none; border-top: 1px dashed #777; margin: 14px 0; opacity: 0.6; }
          .divider-thick { border: none; border-top: 2px solid #000; margin: 12px 0; }
          .divider-thin { border: none; border-top: 1px solid #ddd; margin: 12px 0; }
          
          /* Meta Info Grid */
          .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 10px; font-size: 12px; color: #444; font-weight: 500; }
          .meta-right { text-align: right; }
          .meta-label { color: #777; }
          .meta-value-bold { font-weight: 700; color: #000; }
          .meta-time { font-size: 10px; color: #777; }
          
          /* Items & Rows */
          .order-block { margin-bottom: 6px; }
          .order-label { font-size: 12px; font-weight: 700; text-transform: uppercase; color: #000; margin-bottom: 6px; letter-spacing: 0.5px; }
          
          .item-row { 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            font-size: 13px; 
            margin-bottom: 5px; 
            color: #111; 
            white-space: nowrap;
            gap: 12px;
          }
          .item-details { display: flex; align-items: center; min-w: 0; flex: 1; }
          .item-name { font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
          .item-qty { font-size: 11px; color: #777; margin-left: 6px; font-weight: 500; flex-shrink: 0; }
          .item-price { font-weight: 700; text-align: right; flex-shrink: 0; tabular-nums; }
          
          /* Totals Breakdown */
          .total-row { display: flex; justify-content: space-between; align-items: baseline; margin: 4px 0 10px 0; }
          .total-label { font-size: 14px; font-weight: 900; text-transform: uppercase; color: #000; letter-spacing: 0.5px; }
          .total-amount { font-size: 22px; font-weight: 900; color: #000; tabular-nums; }
          
          .summary-card { background: #f9f9f9; padding: 8px 10px; border-radius: 8px; font-size: 11px; color: #555; font-weight: 500; }
          .summary-line { display: flex; justify-content: space-between; margin-bottom: 3px; }
          .summary-line:last-child { margin-bottom: 0; }
          .summary-bold { color: #111; font-weight: 700; }
          
          /* Transaction Settled Stamp */
          .stamp-container { text-align: center; margin-top: 18px; padding-top: 4px; }
          .paid-badge { 
            display: inline-block; 
            border: 2px dashed #dc2626; 
            color: #dc2626; 
            font-size: 13px; 
            font-weight: 900; 
            text-transform: uppercase; 
            padding: 4px 14px; 
            border-radius: 6px; 
            letter-spacing: 1.5px;
            transform: rotate(-2deg);
          }
          
          /* Footer */
          .footer { text-align: center; margin-top: 20px; font-size: 11px; color: #888; font-style: italic; font-weight: 500; }
        </style>
      </head>
      <body>
        
        <!-- Header Info -->
        <div class="header">
          ${logoUrl ? `<img src="${logoUrl}" class="logo" alt="Logo">` : ""}
          <div class="shop-name">${restaurantName}</div>
          <div class="shop-address">${address || "National Road 1, Yorkbat, Kbalkoh"}</div>
          ${phone ? `<div class="shop-address">Tel: ${phone}</div>` : ""}
        </div>

        <hr class="divider-dashed">

        <!-- Metadata Block -->
        <div class="meta-grid">
          <div><span class="meta-label">Receipt #:</span> <span class="meta-value-bold">${payment.id || "—"}</span></div>
          <div class="meta-right"><span class="meta-label">Table:</span> <span class="meta-value-bold">${payment.session?.table?.table_number ?? payment.session?.tableNumber ?? "—"}</span></div>
          <div><span class="meta-label">Server:</span> <span class="meta-bold-text">${payment.processor?.name ?? "Admin"}</span></div>
          <div class="meta-right meta-time">${new Date(
            payment.createdAt || Date.now(),
          ).toLocaleString("en-US", {
            month: "numeric",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          })}</div>
        </div>

        <hr class="divider-thick">

        <!-- Line Items Loop -->
        ${orders
          .map(
            (order, i) => `
          <div class="order-block">
            <div class="order-label">Order #${i + 1}</div>
            ${order.items
              .map(
                (item) => `
              <div class="item-row">
                <div class="item-details">
                  <span class="item-name">${item.menuName || "Item"}</span>
                  <span class="item-qty">x${item.quantity || 1}</span>
                </div>
                <span class="item-price">${formatAtPaymentCurrency((parseFloat(item.price) || 0) * (item.quantity || 1))}</span>
              </div>
            `,
              )
              .join("")}
          </div>
          ${i < orders.length - 1 ? '<hr class="divider-dashed">' : ""}
        `,
          )
          .join("")}

        <hr class="divider-thin">

        <!-- Total Paid Area -->
        <div class="total-row">
          <span class="total-label">Total Paid</span>
          <span class="total-amount">
            ${formatCashPayable(runningTotal)}
          </span>
        </div>

        <!-- Financial Accounting Data -->
        <div class="summary-card">
          ${
            paymentExchangeRate
              ? `
            <div class="summary-line">
              <span>Exchange Rate:</span>
              <span class="summary-bold">(1$ = ${paymentExchangeRate} រៀល)</span>
            </div>
          `
              : ""
          }
          <div class="summary-line">
            <span>Payment Method:</span>
            <span class="summary-bold" style="text-transform: uppercase;">${payment.method || "—"}</span>
          </div>
          
          ${
            payment.method === "CASH"
              ? `
            <div class="summary-line" style="margin-top: 4px; padding-top: 4px; border-top: 1px dashed #e5e7eb;">
              <span>Cash Received:</span>
              <span class="summary-bold">${formatRaw(displayCashReceived)}</span>
            </div>
            <div class="summary-line">
              <span>Change:</span>
              <span class="summary-bold">${formatRaw(displayChange)}</span>
            </div>
          `
              : ""
          }
        </div>

        <!-- Visual "PAID" Confirmation Badge -->
        <div class="stamp-container">
          <div class="paid-badge">
            ✓ Paid via ${payment.method || "CASH"}
          </div>
        </div>

        <hr class="divider-dashed">

        <!-- Footer Message -->
        <div class="footer">
          ${footerMessage || "Thank you for shopping with us!"}
        </div>
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 250);
};

export default printReceipt;
