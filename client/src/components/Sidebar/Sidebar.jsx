import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Utensils,
} from "lucide-react";
import SidebarItem from "./SidebarItem";
import { navGroups } from "./navItems";
import { useAuth } from "../../contexts/AuthContext";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Filter each group's items by role, drop empty groups
  const visibleGroups = navGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => item.roles.includes(user?.role)),
    }))
    .filter((group) => group.items.length > 0);

  // ── Shared nav content (used in both desktop sidebar and mobile drawer) ──
  const NavContent = ({ collapsed = false, onNavigate }) => (
    <nav className="flex flex-col gap-4 flex-1 overflow-y-auto overflow-x-hidden px-2 py-4">
      {visibleGroups.map((group, i) => (
        <div key={i} className="flex flex-col gap-1">
          {/* Group label — hidden when collapsed */}
          {group.label && !collapsed && (
            <p className="px-2 pb-2 text-[11px] font-bold tracking-widest text-gray-400 uppercase">
              {group.label}
            </p>
          )}

          {/* Divider when collapsed (replace label) */}
          {group.label && collapsed && (
            <div className="mx-2 my-2 h-px bg-gray-200" />
          )}

          <div className="flex flex-col gap-1">
            {group.items.map((item) => (
              <SidebarItem
                key={item.path}
                item={item}
                collapsed={collapsed}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>
      ))}
    </nav>
  );

  // ── Shared footer (profile + logout + collapse) ──
  const FooterContent = ({ collapsed = false, showCollapse = false }) => (
    <div className="shrink-0 px-4 py-4 flex flex-col gap-2 bg-white">
      {/* Profile Card */}
      <div
        className={`flex items-center gap-3 rounded-xl border border-gray-100 shadow-sm p-2.5 mb-2 bg-white ${
          collapsed ? "justify-center" : "justify-between"
        }`}
      >
        <div
          className={`flex items-center rounded-lg border border-gray-100 shadow-sm bg-white ${
            collapsed
              ? "p-1.5 justify-center"
              : "gap-3 px-3 py-2.5 justify-between"
          }`}
        >
          {/* Avatar */}
          <div
            className={`rounded-full bg-red-600 flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-sm ${
              collapsed ? "w-8 h-8" : "w-9 h-9"
            }`}
          >
            {user?.name ? user.name.substring(0, 2).toUpperCase() : "AD"}
          </div>

          {/* Name + role */}
          {!collapsed && (
            <div className="min-w-0 flex flex-col">
              <p className="text-xs font-bold text-gray-800 truncate">
                {user?.name || "Admin"}{" "}
                <span className="font-medium text-gray-500">
                  • {user?.role || "ADMIN"}
                </span>
              </p>
              <p className="text-[11px] text-gray-500 truncate mt-0.5">
                Administrator
              </p>
            </div>
          )}
        </div>

        {!collapsed && (
          <ChevronDown
            size={16}
            strokeWidth={2}
            className="text-gray-400 shrink-0"
          />
        )}
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors ${
          collapsed ? "justify-center" : ""
        }`}
      >
        <LogOut size={18} strokeWidth={2} className="shrink-0" />
        {!collapsed && <span>Logout</span>}
      </button>

      {/* Collapse toggle — desktop only */}
      {showCollapse && (
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors ${
            collapsed ? "justify-center" : ""
          }`}
        >
          {collapsed ? (
            <ChevronRight size={18} strokeWidth={2} className="shrink-0" />
          ) : (
            <>
              <ChevronLeft size={18} strokeWidth={2} className="shrink-0" />
              <span>Minimize</span>
            </>
          )}
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside
        className={`hidden lg:flex flex-col h-screen border-r border-gray-100 bg-white shrink-0 transition-all duration-300 ${
          collapsed ? "w-20" : "w-[260px]"
        }`}
      >
        {/* Logo Area */}
        <div className="flex items-center gap-3 h-20 px-6 shrink-0 mt-2">
          <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white shrink-0 shadow-sm shadow-red-200">
            <Utensils size={18} strokeWidth={2.5} />
          </div>
          {!collapsed && (
            <span className="text-[15px] font-extrabold tracking-widest text-red-600 uppercase">
              Restaurant
            </span>
          )}
        </div>

        <NavContent collapsed={collapsed} />
        <FooterContent collapsed={collapsed} showCollapse />
      </aside>

      {/* ── Mobile: top bar ── */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 h-16 border-b border-gray-100 bg-white">
        {/* Hamburger */}
        <button
          onClick={() => setMobileOpen(true)}
          className="flex flex-col justify-center items-center w-10 h-10 rounded-lg gap-1.5 shrink-0 border border-gray-200 bg-gray-50"
          aria-label="Open menu"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block w-4 h-[2px] rounded-full bg-gray-600"
            />
          ))}
        </button>

        {/* Logo center */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white shadow-sm">
            <Utensils size={14} strokeWidth={2.5} />
          </div>
        </div>

        {/* User avatar */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-gray-800 leading-none">
              {user?.name}
            </p>
            <p className="text-[10px] mt-1 uppercase tracking-wider font-semibold text-gray-500">
              {user?.role}
            </p>
          </div>
          <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center text-sm font-bold text-white shrink-0 shadow-sm">
            {user?.name ? user.name.substring(0, 2).toUpperCase() : "AD"}
          </div>
        </div>
      </header>

      {/* ── Mobile: backdrop ── */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile: slide-in drawer ── */}
      <aside
        className={`lg:hidden fixed top-0 left-0 z-50 flex flex-col h-full w-[280px] bg-white border-r border-gray-100 shadow-2xl transition-transform duration-300 ease-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between h-20 px-6 shrink-0 mt-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white shrink-0 shadow-sm">
              <Utensils size={18} strokeWidth={2.5} />
            </div>
            <span className="text-[15px] font-extrabold tracking-widest text-red-600 uppercase">
              Restaurant
            </span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="text-gray-400 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <NavContent onNavigate={() => setMobileOpen(false)} />
        <FooterContent />
      </aside>
    </>
  );
};

export default Sidebar;
