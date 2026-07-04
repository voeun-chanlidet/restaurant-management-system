import { useEffect, useState } from "react";
import dashboardServices from "../services/dashboard";
import { useSettings } from "../contexts/SettingsContext";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { STATUS_STYLES } from "../utils/orderStatus";
import {
  TrendingUp,
  Receipt,
  Loader2,
  Bell,
  ArrowUpRight,
  ExternalLink,
  Sofa,
  Image as ImageIcon,
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { formatPrice } = useSettings();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await dashboardServices.getDashboardSummary();
        setData(res.summary);
      } catch (err) {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-neutral-400 font-sans">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
        <span className="text-sm font-medium">Loading dashboard data...</span>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-2 text-rose-500 font-sans">
        <span className="text-lg font-semibold">Error Loading Dashboard</span>
        <span className="text-sm text-neutral-400">{error}</span>
      </div>
    );

  const totalOrders = data.todayOrders.reduce(
    (sum, s) => sum + parseInt(s.statusCount),
    0,
  );

  const tablePercent =
    data.allTables > 0
      ? Math.round((data.activeTables / data.allTables) * 100)
      : 0;

  return (
    <div className="p-6 md:p-8 w-full max-w-400 mx-auto font-sans bg-neutral-50/50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-heading flex items-center gap-2">
            Welcome back, {user?.name ?? "Admin"}!
          </h1>
          <p className="text-neutral-500 text-sm mt-1 font-medium">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Revenue Card */}
        <div className="bg-white border border-neutral-100 rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-bold text-neutral-400 tracking-wider uppercase">
              Today's Revenue
            </span>
            <div className="p-1.5 rounded-lg bg-brand/5 text-brand">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-center gap-3 mb-1">
            <span className="text-3xl font-bold text-heading tracking-tight">
              {formatPrice(data.todayRevenue)}
            </span>
            {/* <span className="flex items-center text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
              <ArrowUpRight className="w-3 h-3 mr-0.5 stroke-3" /> 12.5%
            </span> */}
          </div>

          <span className="text-xs text-neutral-400 font-medium mb-6">
            From served orders
          </span>

          {/* Sparkline Chart (SVG) */}
          <div className="h-10 mt-auto w-full">
            <svg
              className="w-full h-full text-brand"
              viewBox="0 0 100 30"
              preserveAspectRatio="none"
            >
              <path
                d="M0 25 C 20 20, 30 28, 50 15 C 65 5, 80 18, 100 2"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M0 25 C 20 20, 30 28, 50 15 C 65 5, 80 18, 100 2 L 100 30 L 0 30 Z"
                fill="url(#gradRevenue)"
                stroke="none"
              />
              <defs>
                <linearGradient id="gradRevenue" x1="0" x2="0" y1="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="currentColor"
                    stopOpacity="0.15"
                  />
                  <stop
                    offset="100%"
                    stopColor="currentColor"
                    stopOpacity="0"
                  />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Orders Card */}
        <div className="bg-white border border-neutral-100 rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-bold text-neutral-400 tracking-wider uppercase">
              Today's Orders
            </span>
            <div className="p-1.5 rounded-lg bg-brand/5 text-brand">
              <Receipt className="w-4 h-4" />
            </div>
          </div>

          <span className="text-3xl font-bold text-heading tracking-tight mb-2">
            {totalOrders}
          </span>
          <div className="flex flex-wrap gap-2 mb-6">
            {data.todayOrders.map((s, idx) => (
              <span
                key={idx}
                className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${STATUS_STYLES[s.status] || "bg-gray-100 text-gray-600"}`}
              >
                {s.statusCount} {s.status.toLowerCase().replace("_", " ")}
              </span>
            ))}
          </div>

          <div className="mt-auto flex flex-col gap-1.5">
            <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand/60 rounded-full transition-all"
                style={{ width: `${Math.min((totalOrders / 50) * 100, 100)}%` }}
              />
            </div>
            <span className="text-[10px] text-neutral-400 font-medium">
              {totalOrders} orders today
            </span>
          </div>
        </div>

        {/* Active Tables Card */}
        <div className="bg-white border border-neutral-100 rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-bold text-neutral-400 tracking-wider uppercase">
              Active Tables
            </span>
            <div className="p-1.5 rounded-lg bg-brand/5 text-brand">
              <Sofa className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-center justify-between mt-auto">
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-heading tracking-tight mb-1">
                {data.activeTables}
              </span>
              <span className="text-xs text-neutral-400 font-medium">
                Out of {data.allTables} total tables
              </span>
            </div>

            {/* Circular Progress Ring */}
            <div className="relative w-14 h-14 flex items-center justify-center">
              <svg
                className="w-full h-full transform -rotate-90"
                viewBox="0 0 36 36"
              >
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#f5f5f5"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray={`${tablePercent}, 100`}
                  className="text-brand"
                />
              </svg>

              <span className="absolute text-[10px] font-bold text-heading">
                {tablePercent}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom grid: Top Items + Recent Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Items */}
        <div className="bg-white border border-neutral-100 rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[11px] font-bold text-neutral-400 tracking-wider uppercase">
              Top Selling Items
            </h2>
            <button
              onClick={() => navigate("/orders")}
              className="text-xs font-semibold text-neutral-500 hover:text-heading transition-colors"
            >
              View all
            </button>
          </div>

          <div className="flex flex-col gap-4 flex-1">
            {data.topOrders.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-3 min-w-0"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span
                    className={`w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 ${
                      i === 0
                        ? "bg-brand text-white shadow-sm"
                        : "bg-neutral-100 text-neutral-500"
                    }`}
                  >
                    {i + 1}
                  </span>

                  {/* Image Thumbnail Placeholder */}
                  <div className="w-10 h-10 rounded-xl border border-neutral-200 flex items-center justify-center shrink-0 overflow-hidden">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        className="w-full h-full object-cover"
                        alt={item.menuName}
                      />
                    ) : (
                      <ImageIcon className="w-4 h-4 text-neutral-300" />
                    )}
                  </div>

                  <span className="text-sm font-semibold text-heading truncate">
                    {item.menuName}
                  </span>
                </div>
                <span className="text-sm font-bold text-brand shrink-0">
                  ×{item.totalQuantity}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate("/orders")}
            className="mt-6 w-full py-3 rounded-xl border border-neutral-100 text-xs font-bold text-heading hover:bg-neutral-50 transition-colors flex items-center justify-center gap-2"
          >
            View full orders{" "}
            <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
          </button>
        </div>

        {/* Recent Payments */}
        <div className="bg-white border border-neutral-100 rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[11px] font-bold text-neutral-400 tracking-wider uppercase">
              Recent Payments
            </h2>
            <button
              onClick={() => navigate("/payments")}
              className="text-xs font-semibold text-neutral-500 hover:text-heading transition-colors"
            >
              View all
            </button>
          </div>

          <div className="flex flex-col gap-4 flex-1">
            {data.recentPayments.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  {/* Icon Block */}
                  <div className="w-10 h-10 rounded-xl bg-brand/5 flex items-center justify-center shrink-0">
                    <Sofa className="w-4 h-4 text-brand" />
                  </div>

                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-sm font-bold text-heading">
                      Table {p.session?.table?.table_number ?? "—"}
                    </span>
                    <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 font-medium">
                      <span>{p.processor?.name ?? "—"}</span>
                      <span>•</span>
                      <span>{p.method}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-0.5 shrink-0">
                  <span className="text-sm font-bold text-brand">
                    {formatPrice(p.totalAmount)}
                  </span>
                  <span className="text-[11px] text-neutral-400 font-medium">
                    {new Date(p.createdAt).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate("/payments")}
            className="mt-6 w-full py-3 rounded-xl border border-neutral-100 text-xs font-bold text-heading hover:bg-neutral-50 transition-colors flex items-center justify-center gap-2"
          >
            View all payments{" "}
            <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
