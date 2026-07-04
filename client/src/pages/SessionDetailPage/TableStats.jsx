import { useSettings } from "../../contexts/SettingsContext";
import { Wallet, CheckCircle, Package } from "lucide-react";
const TableStats = ({ orderCount, itemCount, runningTotal }) => {
  const { formatPrice } = useSettings();
  const stats = [
    {
      label: "ORDERS",
      value: orderCount,
      subtext: "Non-cancelled",
      icon: <CheckCircle className="w-5 h-5 text-indigo-500" strokeWidth={2} />,
      iconBg: "bg-indigo-50",
    },
    {
      label: "ITEMS",
      value: itemCount,
      subtext: "Total quantity",
      icon: <Package className="w-5 h-5 text-emerald-500" strokeWidth={2} />,
      iconBg: "bg-emerald-50",
    },
    {
      label: "RUNNING TOTAL",
      value: formatPrice(runningTotal),
      subtext: "Excludes cancelled",
      icon: <Wallet className="w-5 h-5 text-amber-500" />,
      iconBg: "bg-amber-50",
    },
  ];

  return (
    // Changed to grid-cols-3 for all screen sizes, reduced gap on mobile
    <div className="grid grid-cols-3 gap-2 md:gap-4 mb-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          // Stacked flex-col on mobile, flex-row on desktop. Adjusted padding for mobile.
          className="rounded-xl p-3 md:p-5 bg-white border border-gray-100 shadow-sm flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-2 md:gap-4 overflow-hidden"
        >
          <div className={`p-2 md:p-3 rounded-full shrink-0 ${stat.iconBg}`}>
            {stat.icon}
          </div>
          <div className="min-w-0">
            <p className="text-[9px] md:text-[11px] font-bold text-gray-400 mb-0.5 tracking-wider uppercase truncate">
              {stat.label}
            </p>
            <p className="text-sm md:text-xl font-bold text-gray-900 tracking-tight truncate">
              {stat.value}
            </p>
            <p className="hidden md:block text-xs text-gray-400 mt-1 truncate">
              {stat.subtext}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TableStats;
