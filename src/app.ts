import express from 'express';
import cors from 'cors';

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || "*",
  credentials: true,
}));
app.use(express.json());

import { AuthRoutes } from './modules/auth/auth.routes';
import { ProductRoutes } from './modules/products/product.routes';
import { SaleRoutes } from './modules/sales/sale.routes';
import { DashboardRoutes } from './modules/dashboard/dashboard.routes';
import path from 'path';

// Serve uploads static folder
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Base Route
app.get("/", (req, res) => {
  res.send("Mini-ERP Backend is running on port 5000!");
});

// Mount Routes
app.use('/api/auth', AuthRoutes);
app.use('/api/products', ProductRoutes);
app.use('/api/sales', SaleRoutes);
app.use('/api/dashboard', DashboardRoutes);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

export default app;
