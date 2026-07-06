"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardRoutes = void 0;
const express_1 = require("express");
const dashboard_controller_1 = require("./dashboard.controller");
const auth_1 = require("../../middlewares/auth");
const router = (0, express_1.Router)();
// Everyone who is authenticated can view dashboard (or we could restrict to Admin/Manager)
router.get('/', auth_1.verifyToken, dashboard_controller_1.getDashboardStats);
exports.DashboardRoutes = router;
