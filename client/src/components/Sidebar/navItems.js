import {
  Home,
  SquareMenu,
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
        icon: SquareMenu,
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

export const navItems = navGroups.flatMap((g) => g.items);
