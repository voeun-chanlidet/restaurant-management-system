import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import QRCode from "qrcode";

const STATUS_STYLES = {
  AVAILABLE: {
    border: "border-green-500",
    text: "text-green-600",
    badge: "bg-green-100 text-green-700",
    dot: "bg-green-500",
    label: "Available",
  },
  OCCUPIED: {
    border: "border-orange-500",
    text: "text-orange-600",
    badge: "bg-orange-100 text-orange-700",
    dot: "bg-orange-500",
    label: "Occupied",
  },
  RESERVED: {
    border: "border-amber-500",
    text: "text-amber-600",
    badge: "bg-amber-100 text-amber-700",
    dot: "bg-amber-500",
    label: "Reserved",
  },
  MAINTENANCE: {
    border: "border-zinc-400",
    text: "text-zinc-500",
    badge: "bg-zinc-100 text-zinc-600",
    dot: "bg-zinc-500",
    label: "Maintenance",
  },
};

const TableCard = ({ table, onEdit, onTableClick }) => {
  const style = STATUS_STYLES[table.status] || STATUS_STYLES.AVAILABLE;
  const isRound = table.shape === "round";
  const { user } = useAuth();

  const [showMenu, setShowMenu] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!showMenu) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showMenu]);

  async function handleShowQR(e) {
    e.stopPropagation();
    setShowMenu(false);
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
        onClick={() => onTableClick?.(table)}
        className="relative flex flex-col items-center gap-1.5 pt-5 pb-4 px-3 rounded-xl border border-panel-border bg-panel cursor-pointer hover:border-brand transition-colors"
      >
        {/* Status dot */}
        <span
          className={`absolute top-2.5 left-2.5 w-1.5 h-1.5 rounded-full ${style.dot}`}
        />

        {/* ADMIN: ··· dropdown with Edit + QR */}
        {user.role === "ADMIN" && onEdit && (
          <div
            ref={menuRef}
            className="absolute top-1.5 right-1.5"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowMenu((v) => !v)}
              className="text-dimmed hover:text-heading text-sm px-1 py-0.5 rounded transition-colors"
            >
              ···
            </button>
            {showMenu && (
              <div className="absolute right-0 top-6 z-20 bg-panel border border-panel-border rounded-lg shadow-lg min-w-[120px] py-1 text-xs">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                    onEdit(table);
                  }}
                  className="w-full text-left px-3 py-1.5 text-dimmed hover:text-heading hover:bg-panel-border transition-colors"
                >
                  Edit table
                </button>
                <button
                  onClick={handleShowQR}
                  className="w-full text-left px-3 py-1.5 text-dimmed hover:text-heading hover:bg-panel-border transition-colors"
                >
                  Show QR
                </button>
              </div>
            )}
          </div>
        )}

        {/* STAFF: ··· opens QR directly */}
        {user.role === "STAFF" && (
          <button
            onClick={handleShowQR}
            className="absolute top-1.5 right-1.5 text-dimmed hover:text-brand text-sm px-1 py-0.5 rounded transition-colors"
            title="Show QR code"
          >
            ···
          </button>
        )}

        {/* Table icon */}
        <div
          className={`flex items-center justify-center border-2 font-semibold text-xs ${style.border} ${style.text} ${
            isRound ? "rounded-full w-12 h-12" : "rounded-md w-14 h-10"
          }`}
        >
          {table.table_number}
        </div>

        {/* Info */}
        <p className="text-sm font-medium text-heading leading-none">
          {table.table_number}
        </p>
        <p className="text-[11px] text-dimmed">{table.capacity} seats</p>

        <span
          className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${style.badge}`}
        >
          {style.label}
        </span>
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

            <img
              src={qrDataUrl}
              alt={`QR code for table ${table.table_number}`}
              className="w-48 h-48 rounded-xl"
            />

            <p className="text-xs text-[#9a8a70] text-center break-all max-w-[220px]">
              {`${window.location.origin}/order/${table.id}`}
            </p>

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
