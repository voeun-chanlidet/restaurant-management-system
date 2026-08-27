const { roundKhrCash } = require("../utils/currency");
const PDFDocument = require("pdfkit");
const path = require("path");
const {
  Payment,
  Table_Session,
  Order,
  OrderItem,
  Table,
  User,
} = require("../models");
const { getSetting } = require("../services/setting.service");

async function generateReceiptBuffer(paymentId) {
  // ── 1. Fetch data needed for the receipt ──────────────────────────
  const payment = await Payment.findByPk(paymentId, {
    include: [
      {
        model: Table_Session,
        as: "session",
        include: [
          { model: Table },
          {
            model: Order,
            include: [
              {
                model: OrderItem,
                as: "items",
              },
            ],
          },
        ],
      },
      {
        model: User,
        as: "processor",
        attributes: ["name"],
      },
    ],
  });

  if (!payment) throw new Error("Payment not found");

  const session = payment.session;
  // Safely capture nested order items while filtering out cancelled requests
  const orders = (session?.orders || []).filter(
    (o) => o.status !== "CANCELLED",
  );
  const table = session?.table;
  const runningTotal = Number(payment.totalAmount);

  // ── 2. Configuration & Currency Unification ─────────────────────────
  const doc = new PDFDocument({ margin: 50, size: "A5" });
  const chunks = [];
  doc.on("data", (chunk) => chunks.push(chunk));

  // Font Assets Mapping
  const regularKhmerFont = path.join(
    __dirname,
    "../fonts/NotoSansKhmer-Regular.ttf",
  );
  const boldKhmerFont = path.join(__dirname, "../fonts/NotoSansKhmer-Bold.ttf");
  const regularFont = path.join(__dirname, "../fonts/NotoSans-Regular.ttf");
  const boldFont = path.join(__dirname, "../fonts/NotoSans-Bold.ttf");

  const settings = await getSetting();
  const isKhr = payment.paymentCurrency === "KHR";

  // Use the exchange rate from payment time so old receipts stay accurate.
  // Uses live rate only if no rate was saved.
  const exchangeRate = isKhr
    ? parseFloat(payment.exchangeRate) ||
      parseFloat(settings.exchange_rate) ||
      4100
    : parseFloat(settings.exchange_rate) || 4100;

  const displayCashReceived = payment.cashReceived || 0;
  const displayChange = payment.changeAmount || 0;

  const formatRaw = (amount) => {
    if (isKhr) {
      return `${Math.round(Number(amount || 0)).toLocaleString()} រៀល`;
    }
    return `$${parseFloat(amount || 0).toFixed(2)}`;
  };

  const amountFont = isKhr ? regularKhmerFont : regularFont;
  const amountBoldFont = isKhr ? boldKhmerFont : boldFont;

  // ── 3. Draw the Receipt Layout ───────────────────────────────────────

  // Brand Header
  doc
    .fontSize(20)
    .font(boldKhmerFont)
    .fillColor("#111111")
    .text(`${settings.restaurant_name}`, { align: "center" });
  doc
    .fontSize(9)
    .font(regularKhmerFont)
    .fillColor("#555555")
    .text(`${settings.address || "National Road 1, Yorkbat, Kbalkoh"}`, {
      align: "center",
    });

  if (settings.phone || phone) {
    doc.text(`Tel: ${settings.phone || phone}`, { align: "center" });
  }
  doc.moveDown(1);

  // Divider Line
  doc
    .moveTo(50, doc.y)
    .lineTo(345, doc.y)
    .strokeColor("#e5e7eb")
    .lineWidth(1)
    .stroke();
  doc.moveDown(0.8);

  // Balanced 2-Column Metadata Grid
  const metaY = doc.y;
  doc.fontSize(9).font(regularFont).fillColor("#666666");

  // Left Column Data
  doc
    .text(`Receipt #: `, 50, metaY, { continued: true })
    .font(boldFont)
    .fillColor("#111111")
    .text(`${payment.id || "—"}`);
  doc
    .font(regularFont)
    .fillColor("#666666")
    .text(`Server: `, 50, doc.y, { continued: true })
    .font(boldFont)
    .fillColor("#111111")
    .text(`${payment.processor?.name || "Admin"}`);

  // Right Column Data
  doc
    .font(regularFont)
    .fillColor("#666666")
    .text(`Table: `, 220, metaY, { continued: true })
    .font(boldFont)
    .fillColor("#111111")
    .text(`${table?.table_number ?? "—"}`);
  doc
    .font(regularFont)
    .fillColor("#666666")
    .text(
      `Date: ${new Date(payment.createdAt).toLocaleDateString()}`,
      220,
      doc.y,
    );

  doc.moveDown(1);
  doc
    .moveTo(50, doc.y)
    .lineTo(345, doc.y)
    .strokeColor("#111111")
    .lineWidth(1.5)
    .stroke();
  doc.moveDown(1);

  // Loop Order Sections & Line Items
  orders.forEach((order, index) => {
    if (orders.length > 1) {
      doc
        .fontSize(9)
        .font(boldFont)
        .fillColor("#888888")
        .text(`ORDER #${index + 1}`, 50, doc.y);
    }

    order.items.forEach((item) => {
      const itemY = doc.y;

      // Item name details on left side (Guarded with Native PDFKit Ellipsis Truncation)
      doc
        .fontSize(9)
        .font(boldFont)
        .fillColor("#111111")
        .text(`${item.menuName || "Unknown Item"} `, 50, itemY, {
          width: 180,
          ellipsis: true,
          continued: true,
        })
        .font(regularFont)
        .fillColor("#777777")
        .text(` x${item.quantity || 1}`);

      // Subtotals on right side
      const itemSubtotal = (parseFloat(item.price) || 0) * (item.quantity || 1);
      doc
        .fontSize(9)
        .font(amountFont)
        .fillColor("#111111")
        .text(
          isKhr
            ? `${Math.round(itemSubtotal * exchangeRate).toLocaleString()} រៀល`
            : `$${itemSubtotal.toFixed(2)}`,
          245,
          itemY,
          {
            width: 100,
            align: "right",
          },
        );
    });

    if (index < orders.length - 1) {
      doc.moveDown(0.4);
      doc
        .moveTo(50, doc.y)
        .lineTo(345, doc.y)
        .strokeColor("#f3f4f6")
        .lineWidth(1)
        .stroke();
      doc.moveDown(0.4);
    }
  });

  doc.moveDown(0.5);
  doc
    .moveTo(50, doc.y)
    .lineTo(345, doc.y)
    .strokeColor("#e5e7eb")
    .lineWidth(1)
    .stroke();
  doc.moveDown(0.8);

  // Financial Summary Block - Total Settled
  const totalY = doc.y;
  doc
    .fontSize(11)
    .font(boldFont)
    .fillColor("#111111")
    .text("TOTAL PAID", 50, totalY + 4);
  doc
    .fontSize(16)
    .font(amountBoldFont)
    .text(
      isKhr
        ? `${roundKhrCash(runningTotal * exchangeRate).toLocaleString()} រៀល`
        : `$${runningTotal.toFixed(2)}`,
      225,
      totalY,
      {
        width: 120,
        align: "right",
      },
    );

  doc.moveDown(1.2);

  // Core Breakdown Box Details
  const summaryTopY = doc.y;

  doc.fontSize(8).font(regularFont).fillColor("#555555");
  if (exchangeRate) {
    doc
      .font(regularKhmerFont)
      .text(`Exchange Rate: (1$ = ${exchangeRate} រៀល)`, 55, doc.y);
  }
  doc
    .font(regularFont)
    .text(`Payment Method: ${payment.method || "CASH"}`, 55, doc.y);

  if (payment.method === "CASH") {
    doc.moveDown(0.3);
    doc
      .font(amountFont)
      .text(`Cash Received: ${formatRaw(displayCashReceived)}`, 55, doc.y);
    doc.font(amountFont).text(`Change: ${formatRaw(displayChange)}`, 55, doc.y);
  }

  const summaryBottomY = doc.y;

  // Wrap summary details inside a clean framed gray panel block line
  doc
    .roundedRect(50, summaryTopY - 6, 295, summaryBottomY - summaryTopY + 12, 6)
    .strokeColor("#f3f4f6")
    .lineWidth(1)
    .stroke();

  doc.moveDown(1.5);

  // ── Vector Generated Paid Stamp ──────────────────────────────────
  const stampY = doc.y;
  doc
    .lineWidth(1.5)
    .dash(4, { space: 2 })
    .strokeColor("#dc2626")
    .rect(110, stampY, 175, 24)
    .stroke();
  doc.undash(); // Clear dash patterns so it doesn't affect standard layout cuts

  doc
    .fontSize(9)
    .font(boldFont)
    .fillColor("#dc2626")
    .text(` PAID VIA ${payment.method || "CASH"}`, 110, stampY + 7, {
      width: 175,
      align: "center",
    });

  doc.moveDown(2);
  doc
    .moveTo(50, doc.y)
    .lineTo(345, doc.y)
    .strokeColor("#e5e7eb")
    .lineWidth(1)
    .stroke();
  doc.moveDown(1);

  // Footer Branding Section
  doc
    .fontSize(9)
    .font(regularKhmerFont)
    .fillColor("#888888")
    .text(`${settings.footer_message || "Thank you for shopping with us!"}`, {
      align: "center",
    });

  // ── 4. Finalize and Return Document Buffer ───────────────────────────
  doc.end();
  await new Promise((resolve) => doc.on("end", resolve));

  return Buffer.concat(chunks);
}

module.exports = { generateReceiptBuffer };
