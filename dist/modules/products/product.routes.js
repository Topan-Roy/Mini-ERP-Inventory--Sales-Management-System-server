"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRoutes = void 0;
const express_1 = require("express");
const product_controller_1 = require("./product.controller");
const auth_1 = require("../../middlewares/auth");
const upload_1 = require("../../middlewares/upload");
const router = (0, express_1.Router)();
// Employee can view, Admin/Manager can view too
router.get('/', auth_1.verifyToken, product_controller_1.getProducts);
// Only Admin and Manager can manage products
router.post('/', auth_1.verifyToken, (0, auth_1.requireRole)('Admin', 'Manager'), upload_1.upload.single('image'), product_controller_1.createProduct);
router.patch('/:id', auth_1.verifyToken, (0, auth_1.requireRole)('Admin', 'Manager'), upload_1.upload.single('image'), product_controller_1.updateProduct);
router.delete('/:id', auth_1.verifyToken, (0, auth_1.requireRole)('Admin', 'Manager'), product_controller_1.deleteProduct);
exports.ProductRoutes = router;
