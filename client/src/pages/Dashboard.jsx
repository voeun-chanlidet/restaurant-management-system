import { useEffect, useState } from "react";
import dashboardServices from "../services/dashboard";

const StatCard = ({ label, value, sub, icon }) => (
  <div
    style={{
      background: "var(--color-panel)",
      border: "1px solid var(--color-panel-border)",
      borderRadius: "12px",
      padding: "1.25rem 1.5rem",
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <span
        style={{
          fontSize: "13px",
          color: "var(--color-dimmed)",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      <span style={{ fontSize: "20px", color: "var(--color-brand)" }}>
        {icon}
      </span>
    </div>
    <span
      style={{
        fontSize: "28px",
        fontWeight: "700",
        color: "var(--color-heading)",
        lineHeight: 1,
      }}
    >
      {value}
    </span>
    {sub && (
      <span style={{ fontSize: "12px", color: "var(--color-footer)" }}>
        {sub}
      </span>
    )}
  </div>
);

const StatusBadge = ({ status }) => {
  const map = {
    SERVED: { bg: "#14532d", color: "#86efac" },
    IN_PROGRESS: { bg: "#713f12", color: "#fde68a" },
    PENDING: { bg: "#1e3a5f", color: "#93c5fd" },
    CANCELLED: { bg: "#3b1010", color: "#fca5a5" },
    READY: { bg: "#2d1b69", color: "#c4b5fd" },
  };
  const s = map[status] || { bg: "#2a2a2a", color: "#aaa" };
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        fontSize: "11px",
        fontWeight: "600",
        padding: "2px 8px",
        borderRadius: "999px",
        letterSpacing: "0.03em",
      }}
    >
      {status}
    </span>
  );
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await dashboardServices.getDashboardSummary();
        setData(res.summary);
      } catch (err) {
        setError("Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading)
    return (
      <div
        style={{
          color: "var(--color-dimmed)",
          padding: "3rem",
          textAlign: "center",
        }}
      >
        Loading dashboard...
      </div>
    );

  if (error)
    return (
      <div style={{ color: "#fca5a5", padding: "3rem", textAlign: "center" }}>
        {error}
      </div>
    );

  const totalOrders = data.todayOrders.reduce(
    (sum, s) => sum + parseInt(s.statusCount),
    0,
  );

  return (
    <div style={{ padding: "2rem", maxWidth: "1100px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            fontSize: "22px",
            fontWeight: "700",
            color: "var(--color-heading)",
            margin: 0,
          }}
        >
          Dashboard
        </h1>
        <p
          style={{
            color: "var(--color-dimmed)",
            fontSize: "13px",
            marginTop: "4px",
          }}
        >
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Stat Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <StatCard
          label="Today's Revenue"
          value={`$${parseFloat(data.todayRevenue).toFixed(2)}`}
          sub="From served orders"
          icon="💰"
        />
        <StatCard
          label="Today's Orders"
          value={totalOrders}
          sub={`${data.todayOrders.map((s) => `${s.statusCount} ${s.status}`).join(" · ")}`}
          icon="🧾"
        />
        <StatCard
          label="Active Tables"
          value={data.activeTables}
          sub={`Out of ${data.allTables} total tables`}
          icon="🍽️"
        />
      </div>

      {/* Bottom grid: Top Items + Recent Payments */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.4fr",
          gap: "1.25rem",
        }}
      >
        {/* Top Selling Items */}
        <div
          style={{
            background: "var(--color-panel)",
            border: "1px solid var(--color-panel-border)",
            borderRadius: "12px",
            padding: "1.25rem 1.5rem",
          }}
        >
          <h2
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "var(--color-heading)",
              marginBottom: "1rem",
              marginTop: 0,
            }}
          >
            Top Selling Items
          </h2>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            {data.topOrders.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "0.75rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    minWidth: 0,
                  }}
                >
                  <span
                    style={{
                      width: "22px",
                      height: "22px",
                      borderRadius: "50%",
                      background:
                        i === 0
                          ? "var(--color-brand)"
                          : "var(--color-panel-border)",
                      color: i === 0 ? "#0e0e0e" : "var(--color-dimmed)",
                      fontSize: "11px",
                      fontWeight: "700",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {i + 1}
                  </span>
                  <span
                    style={{
                      fontSize: "13px",
                      color: "var(--color-heading)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.menuName}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: "12px",
                    color: "var(--color-brand)",
                    fontWeight: "600",
                    flexShrink: 0,
                  }}
                >
                  ×{item.totalQuantity}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Payments */}
        <div
          style={{
            background: "var(--color-panel)",
            border: "1px solid var(--color-panel-border)",
            borderRadius: "12px",
            padding: "1.25rem 1.5rem",
          }}
        >
          <h2
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "var(--color-heading)",
              marginBottom: "1rem",
              marginTop: 0,
            }}
          >
            Recent Payments
          </h2>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            {data.recentPayments.map((p) => (
              <div
                key={p.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.6rem 0.75rem",
                  background: "var(--color-input)",
                  borderRadius: "8px",
                  gap: "0.5rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                    minWidth: 0,
                  }}
                >
                  <span
                    style={{
                      fontSize: "13px",
                      color: "var(--color-heading)",
                      fontWeight: "500",
                    }}
                  >
                    Table {p.order.tableNumber}
                  </span>
                  <span
                    style={{ fontSize: "11px", color: "var(--color-dimmed)" }}
                  >
                    {p.processor.name} · {p.method}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: "2px",
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontSize: "13px",
                      color: "var(--color-brand)",
                      fontWeight: "600",
                    }}
                  >
                    ${parseFloat(p.order.total).toFixed(2)}
                  </span>
                  <span
                    style={{ fontSize: "11px", color: "var(--color-footer)" }}
                  >
                    {new Date(p.createdAt).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
