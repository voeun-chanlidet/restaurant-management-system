import { NavLink } from "react-router-dom";

const SidebarItem = ({ item, collapsed, onNavigate }) => {
  const Icon = item.icon;

  return (
    <NavLink to={item.path} end={item.path === "/"} onClick={onNavigate}>
      {({ isActive }) => (
        <div
          className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 ${
            isActive
              ? "bg-red-50 text-red-600 font-bold"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium"
          } ${collapsed ? "justify-center" : ""}`}
        >
          {/* Active indicator bar */}
          {isActive && (
            <span
              className={`absolute left-0 top-1/2 -translate-y-1/2 rounded-r-full bg-red-600 ${collapsed ? "w-1 h-5" : "w-1 h-6"}`}
            />
          )}

          {/* Icon */}
          {Icon && (
            <Icon
              size={18}
              strokeWidth={isActive ? 2.5 : 2}
              className="shrink-0"
            />
          )}

          {/* Label — only rendered when expanded to prevent overflow */}
          {!collapsed && (
            <span className="truncate tracking-wide">{item.label}</span>
          )}
        </div>
      )}
    </NavLink>
  );
};

export default SidebarItem;
