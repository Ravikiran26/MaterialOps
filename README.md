# B2B Admin & Operations Portal — Demo

A working demo for a B2B construction-material ordering operation.

## Stack

- Frontend: React + TypeScript + Vite + Tailwind CSS
- Backend: Node.js + Express + TypeScript
- Demo data: in-memory static data
- Production-ready next step: PostgreSQL + Prisma + JWT + WhatsApp Cloud API

## Demo workflow

1. Customer order appears in Operations Portal.
2. Internal operations team reviews the requirement.
3. Team assigns an onboarded vendor.
4. Team updates order status through fulfilment.
5. Vendors, customers, products and reports are visible in separate modules.

## Run locally

### Option A — run both apps separately

Backend:
```bash
cd backend
npm install
npm run dev
```

Frontend:
```bash
cd frontend
npm install
npm run dev
```

Open: `http://localhost:5173`

Backend API: `http://localhost:4000/api`

### Option B — root helper

```bash
npm install
npm run install:all
npm run dev
```

## Important demo note

Changes to vendor assignment and order status are stored only in memory and reset when the backend server restarts. That is intentional for the demo.
