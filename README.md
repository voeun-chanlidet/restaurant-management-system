# Restaurant Management System (RMS)

A full-stack restaurant POS featuring dine-in management, QR self-ordering, real-time kitchen workflows, and dual-currency payments in USD and KHR.

**Live demo:** [Restaurant Management System](https://restaurant-management-system-prod.vercel.app)

Developed as a graduation project, this system brings restaurant ordering, kitchen operations, and payment workflows into one application.

## Demo Access

Explore the restaurant workflows using the demo accounts below.

| Role    | Email             | Password      |
| ------- | ----------------- | ------------- |
| Staff   | `staff@rms.com`   | `password123` |
| Kitchen | `kitchen@rms.com` | `password123` |

**Notes:**

- These accounts are provided for demonstration purposes.
- The application uses fictional sample data.
- Administrative features are showcased through screenshots in this repository.
- Please do not enter real customer or sensitive information.

## Screenshots

### Dashboard

![RMS dashboard](docs/screenshots/01-dashboard.png)

### Dining and table management

![Dining floor map](docs/screenshots/02-dining-floor-map.png)

### Kitchen Display System

![Kitchen Display System](docs/screenshots/06-kitchen-display.png)

### QR self-ordering on mobile

| Menu                                                                      | Cart                                                                           |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| ![QR ordering menu on mobile](docs/screenshots/07-qr-ordering-mobile.png) | ![QR ordering cart on mobile](docs/screenshots/08-qr-ordering-cart-mobile.png) |

### Payments

![Payments overview](docs/screenshots/03-payments-overview.png)

The checkout supports USD and KHR cash payments, including riel cash rounding.

## Features

- **Dining and table management:** monitor table availability and status, open table sessions, and manage orders for each visit.
- **Staff ordering:** place orders for a table and include item-specific notes.
- **QR self-ordering:** customers scan a table QR code, browse the menu, customize their cart, and submit orders without creating an account.
- **Real-time Kitchen Display System:** kitchen staff receive orders and update their progress; connected staff and customer screens receive live status updates.
- **Order lifecycle:** `PENDING → IN_PROGRESS → READY → SERVED`, with support for cancellation.
- **Payments and receipts:** cash payments in USD or KHR, KHQR payment option, payment history, PDF receipts, and printable 80 mm receipts.
- **KHR cash rounding:** cash-payable totals in riel round up to the nearest 100៛, and change is calculated using the rounded payable amount.
- **Admin tools:** dashboard summaries, menu and category management, user management, and restaurant settings.
- **Role-based access:** separate permissions for `ADMIN`, `STAFF`, and `KITCHEN` roles.
- **Menu media:** upload menu images and restaurant assets through Cloudinary.

## Tech stack

| Layer                            | Technologies                                                              |
| -------------------------------- | ------------------------------------------------------------------------- |
| Frontend                         | React 19, Vite 8, Tailwind CSS 4, React Router 7, Axios, Socket.io Client |
| Backend                          | Node.js, Express 5, Sequelize 6, Socket.io 4, JWT, bcrypt                 |
| Database                         | PostgreSQL 16                                                             |
| Media storage                    | Cloudinary                                                                |
| Development and database tooling | Docker Compose, Sequelize CLI migrations and seeders                      |
| Deployment                       | Vercel (frontend), Render (API), Neon (PostgreSQL)                        |

## Architecture

The frontend communicates with the Express REST API using JWT authentication. Socket.io provides real-time order and table updates. The backend separates responsibilities into routes, controllers, services, and models.

```text
React + Vite frontend
        │
        ├── REST API (JWT)
        └── Socket.io
                │
        Express backend
        routes → controllers → services → models
                │
        ├── PostgreSQL (Sequelize)
        └── Cloudinary
```

## Local development

### Prerequisites

- Node.js 20+
- npm
- Docker and Docker Compose
- A Cloudinary account for image uploads

### 1. Clone the repository

```bash
git clone https://github.com/voeun-chanlidet/restaurant-management-system.git
cd restaurant-management-system
```

Install dependencies:

```bash
cd server
npm install

cd ../client
npm install
```

### 2. Configure the local database

Create a `.env` file in the project root for Docker Compose:

```env
POSTGRES_USER=rms_dev
POSTGRES_PASSWORD=replace-with-a-local-password
POSTGRES_DB=rms_local
```

Start PostgreSQL:

```bash
docker compose up -d
```

### 3. Configure environment variables

Create `server/.env`:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
DATABASE_URL=postgres://rms_dev:replace-with-a-local-password@localhost:5432/rms_local
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=1d
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000
```

Use your own local values. Do not commit real secrets or production credentials.

### 4. Initialize the database

Start the backend once so the development database tables are created, then stop it:

```bash
cd server
npm run dev
```

Apply seed data:

```bash
npx sequelize-cli db:seed:all
```

Run any pending migrations as needed:

```bash
npx sequelize-cli db:migrate
```

### 5. Run the application

In one terminal:

```bash
cd server
npm run dev
```

In another terminal:

```bash
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

The seed script creates the default admin account. Use only local development credentials locally, and change/remove default credentials before deploying any instance.

## Project structure

```text
.
├── docker-compose.yml
├── server/
│   ├── lib/                 # Database, socket, and Cloudinary clients
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── services/
│       ├── models/
│       ├── routes/
│       ├── middlewares/
│       ├── utils/
│       ├── migrations/
│       ├── seeders/
│       └── fonts/            # PDF receipt fonts, including Khmer support
└── client/
    └── src/
        ├── pages/
        ├── components/
        ├── contexts/
        ├── hooks/
        ├── services/
        └── utils/
```

## Author

**Voeun Chanlidet**  
[GitHub: @voeun-chanlidet](https://github.com/voeun-chanlidet)
