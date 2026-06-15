import { useState, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import QRCode from "qrcode";

const STATUS_STYLES = {
  AVAILABLE: {
    border: "border-green-500",
    text: "text-green-600",
    badge: "bg-green-100 text-green-700",
    label: "Available",
  },
  OCCUPIED: {
    border: "border-orange-500",
    text: "text-orange-600",
    badge: "bg-orange-100 text-orange-700",
    label: "Occupied",
  },
  RESERVED: {
    border: "border-amber-500",
    text: "text-amber-600",
    badge: "bg-amber-100 text-amber-700",
    label: "Reserved",
  },
  MAINTENANCE: {
    border: "border-zinc-400",
    text: "text-zinc-500",
    badge: "bg-zinc-100 text-zinc-600",
    label: "Maintenance",
  },
};

const TableCard = ({ table, onEdit, onTableClick }) => {
  const style = STATUS_STYLES[table.status] || STATUS_STYLES.AVAILABLE;
  const isRound = table.shape === "round";
  const { user } = useAuth();

  const [showQR, setShowQR] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const canvasRef = useRef(null);

  async function handleShowQR(e) {
    e.stopPropagation();
    const url = `${window.location.origin}/order/${table.id}`;
    const dataUrl = await QRCode.toDataURL(url, {
      width: 240,
      margin: 2,
      color: { dark: "#2d2416", light: "#ffffff" },
    });
    setQrDataUrl(dataUrl);
    setShowQR(true);
  }

  function handleDownload(e) {
    e.stopPropagation();
    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = `table-${table.table_number}-qr.png`;
    link.click();
  }

  function handleClose(e) {
    e.stopPropagation();
    setShowQR(false);
  }

  return (
    <>
      <div
        onClick={() => onTableClick(table)}
        className="flex flex-col items-center gap-2 p-4 rounded-xl border cursor-pointer hover:border-brand transition-colors bg-panel"
        style={{ borderColor: "var(--color-panel-border)" }}
      >
        <div
          className={`flex items-center justify-center border-2 font-semibold text-sm ${style.border} ${style.text} ${isRound ? "rounded-full w-14 h-14" : "rounded-md w-16 h-11"}`}
        >
          {table.table_number}
        </div>

        <p className="text-sm font-medium text-heading">{table.table_number}</p>
        <p className="text-xs text-dimmed">{table.capacity} seats</p>

        <span
          className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${style.badge}`}
        >
          {style.label}
        </span>

        {user.role === "ADMIN" && (
          <div className="flex items-center gap-2 mt-1">
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(table);
                }}
                className="text-xs text-dimmed hover:text-brand"
              >
                ✏️
              </button>
            )}
            <button
              onClick={handleShowQR}
              className="text-xs text-dimmed hover:text-brand"
              title="Show QR code"
            >
              📷
            </button>
          </div>
        )}
      </div>

      {/* QR Modal */}
      {showQR && qrDataUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        >
          <div
            className="bg-white rounded-2xl p-6 flex flex-col items-center gap-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="text-center">
              <p className="text-xs text-[#9a8a70] uppercase tracking-widest font-semibold">
                Table
              </p>
              <p
                className="text-2xl font-bold text-[#2d2416]"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                {table.table_number}
              </p>
            </div>

            {/* QR Code */}
            <img
              src={qrDataUrl}
              alt={`QR code for table ${table.table_number}`}
              className="w-48 h-48 rounded-xl"
            />

            {/* URL */}
            <p className="text-xs text-[#9a8a70] text-center break-all max-w-55">
              {`${window.location.origin}/order/${table.id}`}
            </p>

            {/* Actions */}
            <div className="flex gap-3 w-full">
              <button
                onClick={handleClose}
                className="flex-1 py-2.5 rounded-xl border border-[#ede8df] text-sm font-medium text-[#6b5c45] hover:bg-[#f5f0e8] transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleDownload}
                className="flex-1 py-2.5 rounded-xl bg-[#2d2416] text-white text-sm font-medium hover:bg-[#3d3426] transition-colors"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TableCard;
