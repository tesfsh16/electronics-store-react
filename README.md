# Tesfsh Electronics Store 🛒

A complete full-stack e-commerce store for electronics, built for the Ethiopian market.
Prices in ETB, payment via Chapa (Telebirr, CBE, cards) or Cash on Delivery.

## Features

- **Customer side:** browse, search, filter, cart, checkout, order history
- **Payments:** Chapa online payment (Telebirr, all Ethiopian banks) or Cash on Delivery
- **Admin side:** manage products (add/edit/delete) and orders (change delivery status)
- **Auth:** JWT login system with customer/admin roles
- **Database:** MongoDB with stock control

## Tech Stack

| Layer   | Technology |
|---------|-----------|
| Frontend | React 19, Vite, Tailwind CSS |
| Backend  | Node.js, Express |
| Database | MongoDB (Mongoose) |
| Payment  | Chapa API |

## Project Structure

```
electronics-store/
├── client/    # React frontend (Vite + Tailwind)
└── server/    # Express API + MongoDB
```

## Getting Started

### 1. Requirements
- Node.js 18+
- MongoDB (local or Atlas)

### 2. Install dependencies

```bash
npm run install:all
```

### 3. Set up environment variables

Copy the example files and fill them in:

```bash
# server
cp server/.env.example server/.env
# client
cp client/.env.example client/.env
```

Server `.env` needs:
- `MONGODB_URI` — your MongoDB connection string
- `JWT_SECRET` — any long random string
- `CHAPA_SECRET_KEY` — from your Chapa dashboard

Client `.env` needs:
- `VITE_API_URL` — the backend address (e.g. `http://localhost:5000`)

### 4. Seed the database (20 sample products + admin account)

```bash
npm run seed
```

### 5. Run

```bash
npm run server   # backend on http://localhost:5000
npm run client   # frontend on http://localhost:5173
```

## Test Admin Account

After seeding:
- Email: `admin@estore.com`
- Password: `admin1234` (change this before going live!)

## API Endpoints

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Logged in |
| GET | `/api/products` | Public |
| POST/PUT/DELETE | `/api/products/...` | Admin |
| POST | `/api/orders` | Logged in |
| GET | `/api/orders/my` | Logged in |
| GET | `/api/orders` | Admin |
| POST | `/api/payments/chapa/initialize` | Logged in |

## Author

**Tesfaye Sherefa** — built while learning full-stack development.
