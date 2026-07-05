# 🔧 Mini ERP — Backend Server

Mini ERP সিস্টেমের Backend API Server। এটি **Node.js + Express.js + TypeScript** দিয়ে তৈরি এবং **MongoDB Atlas** ব্যবহার করে।

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Node.js + TypeScript | Runtime & Language |
| Express.js | Web Framework |
| Mongoose | MongoDB ODM |
| MongoDB Atlas | Cloud Database |
| JWT | Authentication |
| Multer | Image Upload |
| ts-node-dev | Dev Hot Reload |
| dotenv | Environment Variables |

---

## 📁 Project Structure

```
src/
├── app.ts                      # Express App + Route mounting
├── server.ts                   # Server entry point
├── middlewares/
│   ├── auth.ts                 # JWT verify + requireRole
│   └── upload.ts               # Multer file upload config
└── modules/
    ├── auth/
    │   ├── auth.model.ts       # User Schema (Admin/Manager/Employee)
    │   ├── auth.controller.ts  # Login Controller
    │   └── auth.routes.ts      # /api/auth routes
    ├── products/
    │   ├── product.model.ts    # Product Schema
    │   ├── product.controller.ts
    │   └── product.routes.ts   # /api/products routes
    ├── customers/
    │   ├── customer.model.ts   # Customer Schema
    │   ├── customer.controller.ts
    │   └── customer.routes.ts  # /api/customers routes
    ├── sales/
    │   ├── sale.model.ts       # Sale Schema + invoiceNo auto-gen
    │   ├── sale.controller.ts  # Create sale + stock deduction
    │   └── sale.routes.ts      # /api/sales routes
    └── dashboard/
        ├── dashboard.controller.ts  # Stats aggregation
        └── dashboard.routes.ts      # /api/dashboard routes
```

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

`.env` ফাইল তৈরি করুন:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/minierp?appName=Cluster0
JWT_SECRET=your_strong_jwt_secret_here
```

### 3. Seed Database (Default Users তৈরি)

```bash
npx ts-node seed.ts
```

এটি নিচের users তৈরি করবে:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@minierp.com | 123456 |
| Manager | manager@minierp.com | 123456 |
| Employee | employee@minierp.com | 123456 |

### 4. Run Development Server

```bash
npm run dev
```

Server চলবে: `http://localhost:5000`

---

## 🔐 Auth & Role System

### Middleware
- `verifyToken` — JWT token যাচাই করে
- `requireRole(...roles)` — নির্দিষ্ট role থাকলেই access দেয়

### Role Permissions

| Route | Admin | Manager | Employee |
|-------|-------|---------|----------|
| GET /products | ✅ | ✅ | ✅ |
| POST /products | ✅ | ✅ | ❌ |
| GET /customers | ✅ | ✅ | ❌ |
| POST /customers | ✅ | ✅ | ❌ |
| POST /sales | ✅ | ✅ | ✅ |
| GET /dashboard | ✅ | ✅ | ✅ |

---

## 🌐 API Endpoints

### Auth
```
POST /api/auth/login        — Login (returns JWT token)
```

### Products
```
GET    /api/products        — List all products (search, pagination)
POST   /api/products        — Create product (with image upload)
PATCH  /api/products/:id    — Update product
DELETE /api/products/:id    — Delete product
```

### Customers
```
GET    /api/customers       — List all customers
POST   /api/customers       — Create customer
PATCH  /api/customers/:id   — Update customer
DELETE /api/customers/:id   — Delete customer
```

### Sales
```
GET  /api/sales             — List all sales (search, date filter, pagination)
POST /api/sales             — Create sale (auto stock deduction, invoice generation)
GET  /api/sales/:id         — Get single sale (Invoice)
```

### Dashboard
```
GET /api/dashboard          — Stats: products, customers, revenue, chart data, low stock
```

---

## 📦 Image Upload

পণ্যের ছবি `uploads/` ফোল্ডারে সেভ হয় এবং এই URL দিয়ে access করা যায়:

```
http://localhost:5000/uploads/<filename>
```

---

## 📄 License

This project is for educational purposes.
