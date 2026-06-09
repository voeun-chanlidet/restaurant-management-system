const PDFDocument = require("pdfkit");
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
  // ── 1. Fetch all data needed for the receipt ──────────────────────────
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

  const settings = await getSetting();
  const currencySymbol = settings.currency === "KHR" ? "KHR " : "$";

  // Change these two lines
  const session = payment.session; // was payment.TableSession
  const orders = session.orders;
  const table = session.table;
  const total = parseFloat(payment.totalAmount);

  // ── 2. Create PDF document ────────────────────────────────────────────
  const doc = new PDFDocument({ margin: 50, size: "A5" });
  const chunks = [];

  doc.on("data", (chunk) => chunks.push(chunk));

  // ── 3. Draw the receipt ───────────────────────────────────────────────

  // Header
  doc
    .fontSize(18)
    .font("Helvetica-Bold")
    .text(`${settings.restaurant_name}`, { align: "center" });
  doc
    .fontSize(9)
    .font("Helvetica")
    .fillColor("#888888")
    .text(`${settings.address}`, { align: "center" });
  doc.fillColor("#000000").moveDown(1);

  // Divider
  doc.moveTo(50, doc.y).lineTo(345, doc.y).strokeColor("#cccccc").stroke();
  doc.moveDown(0.8);

  // Receipt meta
  doc.fontSize(9).font("Helvetica");
  doc.text(`Receipt #: ${payment.id}`, { align: "left" });
  doc.text(`Date: ${new Date(payment.createdAt).toLocaleString()}`);
  doc.text(`Table: ${table?.table_number ?? "—"}`);
  doc.text(`Processed by: ${payment.processor?.name ?? "—"}`);
  doc.moveDown(0.8);

  doc.moveTo(50, doc.y).lineTo(345, doc.y).strokeColor("#cccccc").stroke();
  doc.moveDown(0.8);

  // Orders and items
  orders.forEach((order, index) => {
    doc
      .fontSize(9)
      .font("Helvetica-Bold")
      .fillColor("#000000")
      .text(`Order #${index + 1}`, 50, doc.y);
    doc.font("Helvetica");

    order.items.forEach((item) => {
      const y = doc.y;
      // Item name + quantity on the left
      doc
        .fontSize(9)
        .fillColor("#444444")
        .text(`${item.menuName} x${item.quantity}`, 55, y, {
          width: 200,
          continued: false,
        });
      // Subtotal on the right — same line
      doc
        .fontSize(9)
        .fillColor("#000000")
        .text(
          `${currencySymbol}${parseFloat(item.subtotal).toFixed(2)}`,
          255,
          y,
          {
            width: 90,
            align: "right",
          },
        );
    });

    doc.moveDown(0.5);
  });

  // Divider
  doc.moveTo(50, doc.y).lineTo(345, doc.y).strokeColor("#cccccc").stroke();
  doc.moveDown(0.8);

  // Total
  const totalY = doc.y;
  doc.fontSize(11).font("Helvetica-Bold").text("TOTAL", 50, totalY);
  doc.text(`${currencySymbol}${total.toFixed(2)}`, 255, totalY, {
    width: 90,
    align: "right",
  });
  doc.moveDown(0.8);

  // Payment details
  doc.fontSize(9).font("Helvetica").fillColor("#444444");
  doc.text(`Payment method: ${payment.method}`);

  if (payment.method === "CASH") {
    doc.text(
      `Amount tendered: ${currencySymbol}${parseFloat(payment.amountTendered).toFixed(2)}`,
    );
    doc.text(
      `Change: ${currencySymbol}${parseFloat(payment.change).toFixed(2)}`,
    );
  }

  doc.moveDown(1);

  // Divider
  doc.moveTo(50, doc.y).lineTo(345, doc.y).strokeColor("#cccccc").stroke();
  doc.moveDown(1);

  // Footer
  doc
    .fontSize(9)
    .font("Helvetica")
    .fillColor("#888888")
    .text(`${settings.footer_message}`, { align: "center" });

  // ── 4. Finalize and return buffer ─────────────────────────────────────
  doc.end();
  await new Promise((resolve) => doc.on("end", resolve));

  return Buffer.concat(chunks);
}

module.exports = { generateReceiptBuffer };
