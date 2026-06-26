# 🍕 FoodKart - Full Stack Food Ordering App

A complete production-ready food e-commerce web application built with **React + Vite** (frontend) and **Node.js + Express** (backend), deployed entirely on **Vercel** from a single GitHub repository.

---

## ✨ Features

### User Features
- Browse food categories (Pizza, Burger, Biryani, Chinese, South Indian, Desserts, Beverages)
- Search foods by name/description
- Filter by category and food type (Veg/Non-Veg)
- Sort by price and rating
- Food detail page with full info
- Add to cart with quantity controls
- Cart persisted in localStorage
- Checkout with Cash on Delivery or dummy Online Payment
- User registration and login (JWT authentication)
- Token persisted in localStorage
- Profile management
- View order history with real-time status tracker
- Order detail page

### Admin Features
- Admin login (separate protected route)
- Dashboard with stats (total foods, orders, users, revenue)
- Add/Edit/Delete food items
- Upload food images via Vercel Blob or URL
- View all orders with filter by status
- Update order status: Pending → Confirmed → Preparing → Out for Delivery → Delivered / Cancelled
- View all registered users

---

## 🛠 Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS, React Router DOM |
| Backend    | Node.js, Express.js (Vercel Functions) |
| Database   | PostgreSQL via Neon (Vercel Marketplace) |
| ORM        | Prisma ORM                          |
| Auth       | JWT + bcryptjs                      |
| Images     | Vercel Blob                         |
| Hosting    | Vercel (frontend + backend)         |
| Repository | GitHub                              |

---

## 📁 Folder Structure

```
foodkart/
├── api/                    # Express backend (Vercel Serverless Function)
│   ├── index.js            # Main Express app + Vercel entry
│   ├── server.js           # Local dev server
│   ├── lib/
│   │   └── prisma.js       # Prisma client singleton
│   ├── middleware/
│   │   └── auth.js         # JWT middleware
│   └── routes/
│       ├── auth.js
│       ├── foods.js
│       ├── orders.js
│       ├── users.js
│       ├── admin.js
│       └── upload.js
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.js             # Seed data
├── src/                    # React frontend
│   ├── components/         # Reusable UI components
│   ├── context/            # Auth + Cart context
│   ├── pages/              # Route pages
│   │   └── admin/          # Admin pages
│   ├── services/
│   │   └── api.js          # Axios instance
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── vercel.json             # Vercel routing config
└── .env.example
```

---

## 🚀 Local Installation

### 1. Clone & Install
```bash
git clone https://github.com/YOUR_USERNAME/foodkart.git
cd foodkart
npm install
```

### 2. Environment Variables
```bash
cp .env.example .env
```
Edit `.env` with your values (see below).

### 3. Prisma Setup
```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

### 4. Run Development
```bash
# Terminal 1 - API server
npm run server

# Terminal 2 - Vite frontend
npm run dev
```

Open http://localhost:5173

---

## 🔑 Environment Variables

Create `.env` in root with:

```env
DATABASE_URL=postgresql://...           # From Vercel Postgres / Neon
JWT_SECRET=your-super-secret-key        # Min 32 chars
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_.. # From Vercel Blob Storage
VITE_API_BASE_URL=/api                  # Keep as /api
```

---

## 🗄 Database Setup (Vercel + Neon Postgres)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click your project → **Storage** tab
3. Click **Create Database** → Select **Postgres (Neon)**
4. Follow prompts to create database
5. Copy the `DATABASE_URL` connection string
6. Add it to Vercel Environment Variables AND your local `.env`

---

## 🖼 Vercel Blob Setup (Image Uploads)

1. Go to Vercel Dashboard → Your Project → **Storage**
2. Click **Create Store** → **Blob**
3. Copy the `BLOB_READ_WRITE_TOKEN`
4. Add it to Vercel Environment Variables AND your local `.env`

> **Note:** Food images can also be added as external URLs (e.g., Unsplash). Blob upload is only needed for file upload feature.

---

## 🌱 Seed Command

Run once after database is created:
```bash
npm run prisma:seed
```

This creates:
- 1 Admin user: `admin@foodkart.com` / `Admin@123`
- 1 Test user: `user@foodkart.com` / `User@123`  
- 20 food items across 7 categories

---

## 📤 GitHub Push

```bash
git init
git add .
git commit -m "Initial commit: FoodKart full-stack app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/foodkart.git
git push -u origin main
```

---

## ▲ Vercel Deployment Steps

### Step 1: Create Vercel Project
1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repository

### Step 2: Configure Build Settings
Vercel should auto-detect Vite. Verify:
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### Step 3: Add Environment Variables
In Vercel → Project → Settings → **Environment Variables**, add:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Your Neon Postgres connection string |
| `JWT_SECRET` | A long random string (32+ chars) |
| `BLOB_READ_WRITE_TOKEN` | From Vercel Blob Storage |
| `VITE_API_BASE_URL` | `/api` |

### Step 4: Connect Storage
- Create Postgres database (if not done): Vercel → Storage → Create → Postgres
- Create Blob store: Vercel → Storage → Create → Blob
- Link both stores to your project

### Step 5: Run Prisma Migration
After first deploy, run migrations via:
```bash
# Set DATABASE_URL in local .env first, then:
npm run prisma:migrate
npm run prisma:seed
```

Or use Vercel's serverless function to run migration (see troubleshooting).

### Step 6: Deploy
Click **Deploy** — Vercel builds and deploys automatically.

### Step 7: Test
- **Frontend:** `https://your-app.vercel.app/`
- **API:** `https://your-app.vercel.app/api/health`
- **Foods API:** `https://your-app.vercel.app/api/foods`
- **Admin Login:** `https://your-app.vercel.app/admin/login`

---

## 👤 Admin Login Credentials

| Field | Value |
|-------|-------|
| Email | `admin@foodkart.com` |
| Password | `Admin@123` |

## 👤 Test User Credentials

| Field | Value |
|-------|-------|
| Email | `user@foodkart.com` |
| Password | `User@123` |

---

## 🧪 User Testing Flow

1. Visit `https://your-app.vercel.app/`
2. Click **Sign Up** → create account
3. Browse **Menu** → add items to cart
4. Click **Cart** → review items
5. **Checkout** → fill delivery info → Place Order (COD)
6. View **My Orders** → track status
7. Try **Demo Admin** credentials to access admin panel

---

## 🔧 Troubleshooting

**API returning 500:** Check that `DATABASE_URL` is set in Vercel Environment Variables.

**Prisma not connecting:** Ensure you've run `prisma migrate deploy` against production DB.

**Images not uploading:** Check `BLOB_READ_WRITE_TOKEN` is correct. Alternatively use image URLs (Unsplash).

**CORS errors:** The `vercel.json` routes all `/api/*` to the Express function. Ensure it's deployed correctly.

**React routes returning 404 on refresh:** The `vercel.json` rewrites handle this — all non-API routes serve `index.html`.

**Database schema out of date:** Run `npx prisma migrate deploy` with production `DATABASE_URL`.

---

## 📜 License

MIT License. Feel free to use for learning or projects.

---

Built with ❤️ using React + Node.js + Vercel
