import express from 'express';
import cors from 'cors';
import path from 'path';

const app = express();

// Middlewares
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://mini-erp-inventory-sales-management.vercel.app',
    process.env.CLIENT_URL
  ].filter(Boolean) as string[],
  credentials: true,
}));
app.use(express.json());

// Serve uploads static folder
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

import { AuthRoutes } from './modules/auth/auth.routes';
import { ProductRoutes } from './modules/products/product.routes';
import { CustomerRoutes } from './modules/customers/customer.routes';
import { SaleRoutes } from './modules/sales/sale.routes';
import { DashboardRoutes } from './modules/dashboard/dashboard.routes';

// Base Route
app.get('/', (req, res) => {
  res.send('Mini-ERP Backend is running on port 5000!');
});

// Mount Routes
app.use('/api/auth', AuthRoutes);
app.use('/api/products', ProductRoutes);
app.use('/api/customers', CustomerRoutes);
app.use('/api/sales', SaleRoutes);
app.use('/api/dashboard', DashboardRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

export default app;
