import { NavLink } from "react-router-dom";

const SidebarItem = ({ item, collapsed, onNavigate }) => {
  return (
    <NavLink to={item.path} end={item.path === "/"} onClick={onNavigate}>
      {({ isActive }) => (
        <div
          className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
            isActive
              ? "text-headingn bg-panel-border"
              : "text-dimmed hover:text-heading hover:bg-panel-border"
          }`}
          // style={isActive ? { background: "var(--color-panel-border)" } : {}}
        >
          {isActive && (
            <span
              className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
              style={{ background: "var(--color-brand)" }}
            />
          )}
          <span
            className={`text-sm font-medium transition-all duration-300 ${
              collapsed ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"
            }`}
          >
            {item.label}
          </span>
          {collapsed && (
            <span
              className="pointer-events-none absolute left-full ml-3 z-50 rounded-md px-2.5 py-1.5 text-xs font-medium shadow-xl opacity-0 translate-x-1 transition-all duration-150 group-hover:opacity-100 group-hover:translate-x-0"
              style={{
                background: "var(--color-panel)",
                color: "var(--color-heading)",
                border: "1px solid var(--color-panel-border)",
              }}
            >
              {item.label}
            </span>
          )}
        </div>
      )}
    </NavLink>
  );
};

export default SidebarItem;
