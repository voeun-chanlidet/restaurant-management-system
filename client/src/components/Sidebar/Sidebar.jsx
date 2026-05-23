import { useState } from "react";
import SidebarItem from "./SidebarItem";
import { navItems } from "./navItems";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const visibleItems = navItems.filter((item) =>
    item.roles.includes(user.role),
  );

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* ── Desktop sidebar (unchanged) ── */}
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

      {/* ── Mobile: hamburger button ── */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-3 left-3 z-50 flex flex-col justify-center items-center w-9 h-9 rounded-lg gap-1.5"
        style={{
          background: "var(--color-panel)",
          border: "1px solid var(--color-panel-border)",
        }}
        aria-label="Open menu"
      >
        <span
          className="block w-4 h-0.5 rounded-full"
          style={{ background: "var(--color-dimmed)" }}
        />
        <span
          className="block w-4 h-0.5 rounded-full"
          style={{ background: "var(--color-dimmed)" }}
        />
        <span
          className="block w-4 h-0.5 rounded-full"
          style={{ background: "var(--color-dimmed)" }}
        />
      </button>

      {/* ── Mobile: backdrop ── */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile: slide-in drawer ── */}
      <aside
        className={`lg:hidden fixed top-0 left-0 z-50 flex flex-col h-full w-64 border-r transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          background: "var(--color-panel)",
          borderColor: "var(--color-panel-border)",
        }}
      >
        {/* Drawer header */}
        <div
          className="flex items-center justify-between h-14 px-4 border-b shrink-0"
          style={{ borderColor: "var(--color-panel-border)" }}
        >
          <span
            className="text-sm font-semibold tracking-widest uppercase"
            style={{ color: "var(--color-brand)" }}
          >
            restaurant
          </span>
          <button
            onClick={() => setMobileOpen(false)}
            className="text-lg leading-none"
            style={{ color: "var(--color-dimmed)" }}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* Drawer nav */}
        <nav className="flex flex-col gap-0.5 flex-1 overflow-y-auto px-2 py-4">
          {visibleItems.map((item) => (
            <SidebarItem
              key={item.path}
              item={item}
              collapsed={false}
              onNavigate={() => setMobileOpen(false)}
            />
          ))}
        </nav>

        {/* Drawer footer */}
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
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
