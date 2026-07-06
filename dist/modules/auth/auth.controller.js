"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_model_1 = require("./auth.model");
// Helper to generate JWT
const generateToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
};
// POST /api/auth/register
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
        }
        const existingUser = await auth_model_1.User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User with this email already exists' });
        }
        // Only allow valid roles; default to Employee
        const userRole = ['Admin', 'Manager', 'Employee'].includes(role) ? role : 'Employee';
        const user = await auth_model_1.User.create({ name, email, password, role: userRole });
        const payload = { _id: user._id, name: user.name, email: user.email, role: user.role };
        const token = generateToken(payload);
        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: payload,
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.register = register;
// POST /api/auth/login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }
        // Find user with password field explicitly selected
        const user = await auth_model_1.User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
        const payload = { _id: user._id, name: user.name, email: user.email, role: user.role };
        const token = generateToken(payload);
        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: payload,
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.login = login;
// GET /api/auth/me  (get current logged-in user)
const getMe = async (req, res) => {
    try {
        const user = await auth_model_1.User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        return res.status(200).json({ success: true, data: user });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.getMe = getMe;
