# RMS Project — Progress Summary

## Project

Restaurant Management System (POS) — single restaurant, not multi-tenant SaaS.

## Tech Stack

| Layer       | Choice                                                       |
| ----------- | ------------------------------------------------------------ |
| Runtime     | Node.js (CommonJS — require/module.exports)                  |
| Framework   | Express                                                      |
| Database    | PostgreSQL on Aiven cloud                                    |
| ORM         | Sequelize (switched from Prisma v7 due to SSL/engine issues) |
| Auth        | JWT + bcrypt                                                 |
| Frontend    | React + Vite                                                 |
| Styling     | Tailwind v4 with custom theme variables                      |
| HTTP Client | Axios                                                        |

---

## Backend Folder Structure (server/)

```
server/
├── lib/
│   └── database.js
├── src/
│   ├── config/
│   │   └── env.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── category.controller.js
│   │   ├── menu.controller.js
│   │   ├── table.controller.js
│   │   ├── order.controller.js
│   │   ├── payment.controller.js
│   │   └── dashboard.controller.js
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   └── role.middleware.js
│   ├── models/
│   │   ├── index.js
│   │   ├── user.model.js
│   │   ├── category.model.js
│   │   ├── menu.model.js
│   │   ├── table.model.js
│   │   ├── order.model.js
│   │   ├── order_item.model.js
│   │   └── payment.model.js
│   ├── routes/
│   │   ├── index.js
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── category.routes.js
│   │   ├── menu.routes.js
│   │   ├── table.routes.js
│   │   ├── order.routes.js
│   │   ├── payment.routes.js
│   │   └── dashboard.routes.js
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── user.service.js
│   │   ├── category.service.js
│   │   ├── menu.service.js
│   │   ├── table.service.js
│   │   ├── order.service.js
│   │   ├── payment.service.js
│   │   └── dashboard.service.js
│   └── utils/
│       ├── hash.js
│       └── jwt.js
├── app.js
└── server.js
```

## Frontend Folder Structure (client/src/)

```
src/
├── components/
│   ├── Layout.jsx
│   ├── ProtectedRoute.jsx
│   ├── PublicRoute.jsx
│   └── Sidebar/
│       ├── Sidebar.jsx
│       ├── SidebarItem.jsx
│       └── navItems.js
├── contexts/
│   └── AuthContext.jsx
├── pages/
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── Dashboard.jsx
│   ├── MenuPage/
│   │   ├── index.jsx
│   │   ├── MenuCard.jsx
│   │   ├── MenuGrid.jsx
│   │   ├── CategorySidebar.jsx
│   │   ├── CategoryModal.jsx
│   │   └── MenuModal.jsx
│   ├── TablePage/
│   │   ├── index.jsx
│   │   ├── FloorMap.jsx
│   │   ├── TableCard.jsx
│   │   └── TableModal.jsx
│   ├── OrderPage/
│   │   ├── index.jsx
│   │   ├── OrderList.jsx
│   │   ├── OrderCard.jsx
│   │   ├── OrderDetailModal.jsx
│   │   ├── TableSelector.jsx
│   │   ├── MenuSelector.jsx
│   │   └── OrderSummary.jsx
│   └── PaymentPage/
│       ├── index.jsx
│       ├── PaymentList.jsx
│       ├── PaymentCard.jsx
│       ├── PaymentModal.jsx
│       └── PaymentHistory.jsx
├── services/
│   ├── api.js
│   ├── auth.js
│   ├── category.js
│   ├── menu.js
│   ├── table.js
│   ├── order.js
│   ├── payment.js
│   └── dashboard.js
├── App.jsx
└── main.jsx
```

---

## Completed Parts

- Part 0 — Auth: register, login, JWT, role middleware
- Part 1 — User Management: CRUD, admin-only, soft delete
- Part 2 — Category & Menu: CRUD, associations, image URL
- Part 3 — Tables: CRUD, floor map UI, status, shape
- Part 4 — Orders: full backend + frontend
- Part 5 — Payments: full backend + frontend
- Part 6 — Dashboard: summary endpoint + frontend page (today's revenue, orders by status, active tables, top selling items, recent payments)

---

## Models

### User

`id, email, password, name, role (ADMIN|STAFF|KITCHEN), isActive, timestamps`

### Category

`id, name, timestamps`

### Menu

`id, name, price, imageUrl, isAvailable, categoryId FK, timestamps`

### Table

`id, table_number, capacity, status (AVAILABLE|OCCUPIED|RESERVED|MAINTENANCE), shape (round|rect), timestamps`

### Order

`id, tableId FK (nullable), tableNumber (snapshot), status (PENDING|IN_PROGRESS|READY|SERVED|CANCELLED), total, createdBy FK, timestamps`

### OrderItem

`id, orderId FK, menuId FK (nullable), menuName (snapshot), price (snapshot), quantity, subtotal, timestamps`

### Payment

`id, orderId FK (unique), method (CASH|KHQR, default CASH), cashReceived (nullable), change (nullable), processedBy FK, timestamps`

---

## Associations (models/index.js)

```js
Category.hasMany(Menu, { foreignKey: "categoryId" });
Menu.belongsTo(Category, { foreignKey: "categoryId" });

Table.hasMany(Order, { foreignKey: "tableId" });
Order.belongsTo(Table, { foreignKey: "tableId" });

User.hasMany(Order, { foreignKey: "createdBy" });
Order.belongsTo(User, { foreignKey: "createdBy", as: "creator" });

Order.hasMany(OrderItem, { foreignKey: "orderId", as: "items" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });

Menu.hasMany(OrderItem, { foreignKey: "menuId" });
OrderItem.belongsTo(Menu, { foreignKey: "menuId" });

Order.hasOne(Payment, { foreignKey: "orderId" });
Payment.belongsTo(Order, { foreignKey: "orderId" });

User.hasMany(Payment, { foreignKey: "processedBy" });
Payment.belongsTo(User, { foreignKey: "processedBy", as: "processor" });
```

---

## API Routes Done

```
POST   /api/v1/auth/register
POST   /api/v1/auth/login

GET    /api/v1/users
POST   /api/v1/users
GET    /api/v1/users/:id
PATCH  /api/v1/users/:id
DELETE /api/v1/users/:id

GET    /api/v1/categories
POST   /api/v1/categories
PATCH  /api/v1/categories/:id
DELETE /api/v1/categories/:id

GET    /api/v1/menus
POST   /api/v1/menus
PATCH  /api/v1/menus/:id
DELETE /api/v1/menus/:id

GET    /api/v1/tables
POST   /api/v1/tables
PATCH  /api/v1/tables/:id
DELETE /api/v1/tables/:id

GET    /api/v1/orders
POST   /api/v1/orders
GET    /api/v1/orders/:id
GET    /api/v1/orders/unpaid
PATCH  /api/v1/orders/:id/status
PATCH  /api/v1/orders/:id/cancel

GET    /api/v1/payments
GET    /api/v1/payments/order/:orderId
POST   /api/v1/payments

GET    /api/v1/dashboard/summary
```

---

## Key Patterns

### Request flow

```
Route → Controller → Service → Sequelize → DB
```

### Re-fetch pattern after create/update

```js
const payment = await Payment.create({...});
const freshPayment = await Payment.findByPk(payment.id, {
  attributes: [...],
  include: [...]
});
return freshPayment;
```

### Auth in AuthContext

```js
localStorage.setItem("token", data.token);
localStorage.setItem("user", JSON.stringify(data.user));
// user shape: { id, name, email, role }
```

### useAuth hook

```js
import { useAuth } from "../../contexts/AuthContext";
const { user, token, loading } = useAuth();
```

### Role-based rendering

```jsx
{
  user.role === "ADMIN" && <AdminOnlyComponent />;
}
```

### Loading guard in useEffect

```jsx
useEffect(() => {
  if (loading) return;
  fetchData();
  if (user?.role === "ADMIN") fetchAdminData();
}, [loading]);
```

---

## Delete Strategy

| Model     | Strategy                        |
| --------- | ------------------------------- |
| User      | Soft delete (isActive: false)   |
| Category  | Hard delete + guard             |
| Menu      | Hard delete + guard             |
| Table     | Hard delete + guard             |
| Order     | Never delete — CANCELLED status |
| OrderItem | Never delete                    |
| Payment   | Never delete                    |

---

## Tailwind v4 Theme Variables

```css
--color-brand: #c8a96e;
--color-brand-hover: #b8943e;
--color-page: #0e0e0e;
--color-panel: #1a1208;
--color-panel-border: #2a2010;
--color-input: #161616;
--color-heading: #f5ede0;
--color-dimmed: #7a7a7a;
--color-faint: #3a3a3a;
--color-dot-active: #ffffff;
--color-dot-inactive: #3a2a10;
--color-footer: #5a4a30;
```

---

## Remaining Features (Priority Order — 1 week left)

### Must Do

1. **Role separation** — Staff vs Admin views (hide admin-only pages/actions from Staff and Kitchen)
2. **KDS (Kitchen Display System)** — real-time order status updates using Socket.io, dedicated /kitchen route for KITCHEN role
3. **PDF receipt generation** — generate and download receipt after payment

### Skip (not enough time)

- Reservations
- Audit log

---

## Working Style

- Lidet writes backend logic himself, asks Claude for logic in English first, then Claude reviews the code
- Claude writes frontend code directly
- Move fast, build iteratively, one step at a time
