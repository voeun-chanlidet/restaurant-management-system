export const navItems = [
  { label: "Dashboard", path: "/dashboard", roles: ["ADMIN"] },
  { label: "Menu", path: "/menus", roles: ["ADMIN", "STAFF"] },
  { label: "Dining", path: "/dining", roles: ["ADMIN", "STAFF"] },
  { label: "Orders", path: "/orders", roles: ["ADMIN", "STAFF"] },
  { label: "Tables", path: "/tables", roles: ["ADMIN", "STAFF"] },
  { label: "Payments", path: "/payments", roles: ["ADMIN", "STAFF"] },
  { label: "Reservations", path: "/reservations", roles: ["ADMIN", "STAFF"] },
  { label: "Users", path: "/users", roles: ["ADMIN"] },
  { label: "Kitchen", path: "/kitchen", roles: ["KITCHEN", "ADMIN"] },
  { label: "Setting", path: "/settings", roles: ["ADMIN"] },
];
