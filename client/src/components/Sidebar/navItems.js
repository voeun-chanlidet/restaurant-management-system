// export const navItems = [
//   { label: "Dashboard", path: "/dashboard", roles: ["ADMIN"] },
//   { label: "Menu", path: "/menus", roles: ["ADMIN", "STAFF"] },
//   { label: "Dining", path: "/dining", roles: ["ADMIN", "STAFF"] },
//   { label: "Orders", path: "/orders", roles: ["ADMIN", "STAFF"] },
//   { label: "Tables", path: "/tables", roles: ["ADMIN", "STAFF"] },
//   { label: "Payments", path: "/payments", roles: ["ADMIN", "STAFF"] },
//   { label: "Reservations", path: "/reservations", roles: ["ADMIN", "STAFF"] },
//   { label: "Users", path: "/users", roles: ["ADMIN"] },
//   { label: "Kitchen", path: "/kitchen", roles: ["KITCHEN", "ADMIN"] },
//   { label: "Setting", path: "/settings", roles: ["ADMIN"] },
// ];

import {
  Home,
  BookOpen,
  Armchair,
  ShoppingBag,
  Table,
  CreditCard,
  Calendar,
  Users,
  ChefHat,
  Settings,
} from "lucide-react";

export const navGroups = [
  // Dashboard sits at the top without a section header
  {
    label: null,
    items: [
      { label: "Dashboard", path: "/dashboard", roles: ["ADMIN"], icon: Home },
    ],
  },
  {
    label: "OPERATIONS",
    items: [
      {
        label: "Menu",
        path: "/menus",
        roles: ["ADMIN", "STAFF"],
        icon: BookOpen,
      },
      {
        label: "Dining",
        path: "/dining",
        roles: ["ADMIN", "STAFF"],
        icon: Armchair,
      },
      {
        label: "Orders",
        path: "/orders",
        roles: ["ADMIN", "STAFF"],
        icon: ShoppingBag,
      },
      {
        label: "Tables",
        path: "/tables",
        roles: ["ADMIN", "STAFF"],
        icon: Table,
      },
      {
        label: "Payments",
        path: "/payments",
        roles: ["ADMIN", "STAFF"],
        icon: CreditCard,
      },
      {
        label: "Reservations",
        path: "/reservations",
        roles: ["ADMIN", "STAFF"],
        icon: Calendar,
      },
    ],
  },
  {
    label: "MANAGEMENT",
    items: [
      { label: "Users", path: "/users", roles: ["ADMIN"], icon: Users },
      {
        label: "Kitchen",
        path: "/kitchen",
        roles: ["KITCHEN", "ADMIN"],
        icon: ChefHat,
      },
      { label: "Setting", path: "/settings", roles: ["ADMIN"], icon: Settings },
    ],
  },
];

// Flat list kept for any component that still needs it
export const navItems = navGroups.flatMap((g) => g.items);
