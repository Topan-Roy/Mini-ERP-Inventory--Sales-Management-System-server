"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
// Middlewares
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
}));
app.use(express_1.default.json());
// Serve uploads static folder
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
const auth_routes_1 = require("./modules/auth/auth.routes");
const product_routes_1 = require("./modules/products/product.routes");
const customer_routes_1 = require("./modules/customers/customer.routes");
const sale_routes_1 = require("./modules/sales/sale.routes");
const dashboard_routes_1 = require("./modules/dashboard/dashboard.routes");
// Base Route
app.get('/', (req, res) => {
    res.send('Mini-ERP Backend is running on port 5000!');
});
// Mount Routes
app.use('/api/auth', auth_routes_1.AuthRoutes);
app.use('/api/products', product_routes_1.ProductRoutes);
app.use('/api/customers', customer_routes_1.CustomerRoutes);
app.use('/api/sales', sale_routes_1.SaleRoutes);
app.use('/api/dashboard', dashboard_routes_1.DashboardRoutes);
// 404 Handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});
// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
});
exports.default = app;
