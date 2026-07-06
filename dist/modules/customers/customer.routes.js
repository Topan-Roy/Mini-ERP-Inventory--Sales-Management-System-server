"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerRoutes = void 0;
const express_1 = require("express");
const customer_controller_1 = require("./customer.controller");
const auth_1 = require("../../middlewares/auth");
const router = (0, express_1.Router)();
// All roles can view customers
router.get('/', auth_1.verifyToken, customer_controller_1.getCustomers);
router.get('/:id', auth_1.verifyToken, customer_controller_1.getCustomerById);
// Admin and Manager can manage customers
router.post('/', auth_1.verifyToken, (0, auth_1.requireRole)('Admin', 'Manager'), customer_controller_1.createCustomer);
router.patch('/:id', auth_1.verifyToken, (0, auth_1.requireRole)('Admin', 'Manager'), customer_controller_1.updateCustomer);
router.delete('/:id', auth_1.verifyToken, (0, auth_1.requireRole)('Admin'), customer_controller_1.deleteCustomer);
exports.CustomerRoutes = router;
