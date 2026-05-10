import { useState } from "react";
import SidebarItem from "./SidebarItem";
import { NAV_ITEMS } from "./navItems";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.role || item.role === user?.role,
  );

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <aside
        className={`hidden lg:flex flex-col h-screen border-r shrink-0 transition-all duration-300 ${
          collapsed ? "w-14" : "w-56"
        }`}
        style={{
          background: "var(--color-panel)",
          borderColor: "var(--color-panel-border)",
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center h-14 px-4 border-b shrink-0"
          style={{ borderColor: "var(--color-panel-border)" }}
        >
          {collapsed ? (
            <span className="font-bold" style={{ color: "var(--color-brand)" }}>
              R
            </span>
          ) : (
            <span
              className="text-sm font-semibold tracking-widest uppercase"
              style={{ color: "var(--color-brand)" }}
            >
              restaurant
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-0.5 flex-1 overflow-y-auto px-2 py-4">
          {visibleItems.map((item) => (
            <SidebarItem key={item.path} item={item} collapsed={collapsed} />
          ))}
        </nav>

        {/* Footer */}
        <div
          className="shrink-0 border-t px-2 py-3"
          style={{ borderColor: "var(--color-panel-border)" }}
        >
          <div
            className="px-3 py-1.5 text-xs mb-1"
            style={{ color: "var(--color-footer)" }}
          >
            {user?.name} · {user?.role}
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors"
            style={{ color: "var(--color-dimmed)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--color-heading)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--color-dimmed)")
            }
          >
            <span>←</span>
            {!collapsed && <span>Logout</span>}
          </button>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors mt-0.5"
            style={{ color: "var(--color-dimmed)" }}
          >
            <span>{collapsed ? "→" : "←"}</span>
            {!collapsed && <span>Minimize</span>}
          </button>
        </div>
      </aside>

      {/* Bottom nav — mobile only */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 flex items-center lg:hidden border-t"
        style={{
          background: "var(--color-panel)",
          borderColor: "var(--color-panel-border)",
        }}
      >
        {visibleItems.map((item) => (
          <SidebarItem key={item.path} item={item} variant="bottom" />
        ))}
      </nav>
    </>
  );
};

export default Sidebar;
