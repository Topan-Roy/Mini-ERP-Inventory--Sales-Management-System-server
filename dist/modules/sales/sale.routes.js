"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaleRoutes = void 0;
const express_1 = require("express");
const sale_controller_1 = require("./sale.controller");
const auth_1 = require("../../middlewares/auth");
const router = (0, express_1.Router)();
// Admin, Manager, Employee can all view and create sales
router.get('/', auth_1.verifyToken, sale_controller_1.getSales);
router.get('/:id', auth_1.verifyToken, sale_controller_1.getSaleById);
router.post('/', auth_1.verifyToken, (0, auth_1.requireRole)('Admin', 'Manager', 'Employee'), sale_controller_1.createSale);
exports.SaleRoutes = router;
