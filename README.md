# RMS Project — Progress Summary

> Paste this at the start of a new chat to continue where we left off.

---

## Project

**Restaurant Management System (POS)** — single restaurant, not multi-tenant SaaS (future scope).

---

## Tech Stack

| Layer       | Choice                                                       |
| ----------- | ------------------------------------------------------------ |
| Runtime     | Node.js (CommonJS — `require/module.exports`)                |
| Framework   | Express                                                      |
| Database    | PostgreSQL on Aiven cloud                                    |
| ORM         | Sequelize (switched from Prisma v7 due to SSL/engine issues) |
| Auth        | JWT + bcrypt                                                 |
| Frontend    | React + Vite                                                 |
| Styling     | Tailwind v4 with custom theme variables                      |
| HTTP Client | Axios                                                        |

---

## Backend Folder Structure (`server/`)

```
server/
├── lib/
│   └── database.js           # Sequelize connection with SSL for Aiven
├── src/
│   ├── config/
│   │   └── env.js            # Centralized env variables
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── category.controller.js
│   │   ├── menu.controller.js
│   │   └── table.controller.js
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   └── role.middleware.js
│   ├── models/
│   │   ├── index.js          # Associations defined here
│   │   ├── user.model.js
│   │   ├── category.model.js
│   │   ├── menu.model.js
│   │   └── table.model.js
│   ├── routes/
│   │   ├── index.js
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── category.routes.js
│   │   ├── menu.routes.js
│   │   └── table.routes.js
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── user.service.js
│   │   ├── category.service.js
│   │   ├── menu.service.js
│   │   └── table.service.js
│   └── utils/
│       ├── hash.js
│       └── jwt.js
├── app.js
├── server.js
└── .env
```

---

## Frontend Folder Structure (`client/src/`)

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
│   └── TablePage/
│       ├── index.jsx         # State, handlers, layout
│       ├── FloorMap.jsx      # Grid of TableCards
│       ├── TableCard.jsx     # Single table shape card
│       └── TableModal.jsx    # Add/edit modal
├── services/
│   ├── api.js
│   ├── auth.js
│   ├── category.js
│   ├── menu.js
│   └── table.js
├── App.jsx
└── main.jsx
```

---

## Key Patterns Established

### Request flow

```
Route → Controller → Service → Sequelize → DB
```

### Auth middleware usage in routes

```js
router.get("/", protect, getAllTables);
router.post("/", protect, restrictTo("ADMIN"), createTable);
router.patch("/:id", protect, restrictTo("ADMIN"), updateTable);
router.delete("/:id", protect, restrictTo("ADMIN"), deleteTable);
```

### Sequelize model pattern

```js
class Table extends Model {}
Table.init(
  { fields },
  { sequelize, underscored: true, timestamps: true, modelName: "table" },
);
module.exports = Table;
```

### Associations in `models/index.js`

```js
Category.hasMany(Menu, { foreignKey: "categoryId" });
Menu.belongsTo(Category, { foreignKey: "categoryId" });
module.exports = { User, Category, Menu, Table };
```

### Service pattern

```js
const getAllTables = async () => {
  return await Table.findAll();
};
```

### Controller pattern

```js
const getAllTables = async (request, response) => {
  try {
    const tables = await TableServices.getAllTables();
    return response.status(200).json({ tables });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
};
```

### 404 vs 500 error handling in controllers

```js
const updateTable = async (request, response) => {
  try {
    const id = request.params.id;
    const data = request.body;
    const updatedTable = await TableServices.updateTable(id, data);
    return response.status(200).json({ table: updatedTable });
  } catch (error) {
    const status = error.message === "Table not found!" ? 404 : 500;
    return response.status(status).json({ error: error.message });
  }
};
```

### Frontend service pattern

```js
const getAllTables = async () => {
  const response = await api.get("/tables");
  return response.data;
};
export default { getAllTables, createTable, updateTable, deleteTable };
```

### Component pattern (props down, callbacks up)

```jsx
<TableCard table={table} onEdit={openEditModal} />
const TableCard = ({ table, onEdit }) => { ... }
```

---

## Tailwind v4 Theme Variables (index.css)

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

## Completed Parts

- Part 0 — Auth: register, login, JWT middleware, role middleware
- Part 1 — User Management: CRUD, admin-only, soft delete (isActive)
- Part 2 — Category & Menu: CRUD, Sequelize associations, image URL support
- Part 3 — Tables: CRUD, floor map UI, status management, shape (round/rect)
- Frontend — Login, Register, AuthContext, Layout, Sidebar, MenuPage, TablePage

---

## Models

### User

```
id          INTEGER PK autoIncrement
email       STRING unique, allowNull: false
password    STRING allowNull: false
name        STRING allowNull: false
role        ENUM ADMIN | STAFF | KITCHEN (default: STAFF)
isActive    BOOLEAN default: true
createdAt   auto
updatedAt   auto
```

### Category

```
id          INTEGER PK autoIncrement
name        STRING unique, allowNull: false
createdAt   auto
updatedAt   auto
```

### Menu

```
id            INTEGER PK autoIncrement
name          STRING unique, allowNull: false
price         DECIMAL(10,2) allowNull: false
imageUrl      STRING allowNull: true
isAvailable   BOOLEAN default: true
categoryId    INTEGER FK → categories.id
createdAt     auto
updatedAt     auto
```

### Table

```
id            INTEGER PK autoIncrement
table_number  STRING unique, allowNull: false
capacity      INTEGER allowNull: false
status        ENUM AVAILABLE | OCCUPIED | RESERVED | MAINTENANCE (default: AVAILABLE)
shape         ENUM round | rect (default: round)
createdAt     auto
updatedAt     auto
```

---

## API Routes Done

```
POST   /api/v1/auth/register
POST   /api/v1/auth/login

GET    /api/v1/users          # ADMIN only
POST   /api/v1/users          # ADMIN only
GET    /api/v1/users/:id      # ADMIN only
PATCH  /api/v1/users/:id      # ADMIN only
DELETE /api/v1/users/:id      # ADMIN only (soft delete)

GET    /api/v1/categories     # protected
POST   /api/v1/categories     # ADMIN only
PATCH  /api/v1/categories/:id # ADMIN only
DELETE /api/v1/categories/:id # ADMIN only

GET    /api/v1/menus          # protected
POST   /api/v1/menus          # ADMIN only
PATCH  /api/v1/menus/:id      # ADMIN only
DELETE /api/v1/menus/:id      # ADMIN only

GET    /api/v1/tables         # protected (all roles)
POST   /api/v1/tables         # ADMIN only
PATCH  /api/v1/tables/:id     # ADMIN only
DELETE /api/v1/tables/:id     # ADMIN only
```

---

## Delete Strategy

| Model     | Strategy                                     |
| --------- | -------------------------------------------- |
| User      | Soft delete (`isActive: false`)              |
| Category  | Hard delete + guard (block if menus exist)   |
| Menu      | Hard delete + guard (block if active orders) |
| Table     | Hard delete + guard (block if active orders) |
| Order     | Never delete — financial audit trail         |
| OrderItem | Never delete — part of order history         |

---

## Important Design Decisions

### Table delete with historical orders

When deleting a table that had past orders:

- Block deletion if active orders exist (`PENDING` or `IN_PROGRESS`)
- Nullify `tableId` FK on completed orders — snapshot `table_number` preserves history
- Order model must store `table_number` as a plain string (snapshot) alongside the FK

### Sequelize sync strategy

- Using plain `sequelize.sync()` — only creates tables if they don't exist
- To apply model changes: temporarily switch to `sync({ alter: true })`, restart, revert
- Never use `sync({ force: true })` — drops and recreates all tables

### All route paths are plural

`/tables`, `/menus`, `/categories`, `/users`, `/orders`, `/payments`, `/reservations`

---

## Known Issues / To Address Later

- After saving a menu item, `fetchData()` resets `selectedCategory` — fix with `setSelectedCategory(prev => prev ? prev : catData.categories[0]?.id ?? null)`
- CategorySidebar responsiveness on mobile may need polish
- lucide-react removed due to hook conflict — using text symbols for icons

---

## Next — Part 4: Orders

### Models needed

**Order**

```
id            INTEGER PK autoIncrement
tableId       INTEGER FK → tables.id (nullable for history)
table_number  STRING  — snapshot of table number at order time
status        ENUM PENDING | IN_PROGRESS | READY | SERVED (default: PENDING)
total         DECIMAL(10,2)
createdBy     INTEGER FK → users.id
createdAt     auto
updatedAt     auto
```

**OrderItem**

```
id          INTEGER PK autoIncrement
orderId     INTEGER FK → orders.id
menuId      INTEGER FK → menu_items.id (nullable)
menu_name   STRING  — snapshot
price       DECIMAL(10,2) — snapshot
quantity    INTEGER
subtotal    DECIMAL(10,2)
createdAt   auto
updatedAt   auto
```

### Routes to build

```
GET    /api/v1/orders              # ADMIN + STAFF
POST   /api/v1/orders              # ADMIN + STAFF
GET    /api/v1/orders/:id          # ADMIN + STAFF
PATCH  /api/v1/orders/:id/status   # ADMIN + KITCHEN
DELETE /api/v1/orders/:id          # ADMIN only (cancel, not destroy)
```

### Business rules confirmed

- ADMIN and STAFF can create orders
- KITCHEN can only update order status (KDS role)
- STAFF can only edit while status is PENDING
- ADMIN can edit anytime
- Orders are never hard deleted — cancelled orders stay in DB with a CANCELLED status
- Order and OrderItem store snapshots (name, price) so history survives menu changes

### Frontend

- `OrderPage/` — list of active orders with status indicators
- Staff view: select table → pick menu items → submit order
- Order detail view with items breakdown
