const TableStats = ({ orderCount, itemCount, runningTotal }) => {
  const stats = [
    { label: "Orders", value: orderCount },
    { label: "Items", value: itemCount },
    { label: "Running total", value: `$${runningTotal.toFixed(2)}` },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl p-4 bg-panel border backdrop-blur-sm"
          style={{ borderColor: "var(--color-panel-border)" }}
        >
          <p className="text-xs font-medium text-dimmed mb-1 tracking-wide uppercase">
            {stat.label}
          </p>
          <p className="text-2xl font-semibold text-heading font-mono tracking-tight">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
};

export default TableStats;
