"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCustomer = exports.updateCustomer = exports.getCustomerById = exports.getCustomers = exports.createCustomer = void 0;
const customer_model_1 = require("./customer.model");
// POST /api/customers
const createCustomer = async (req, res) => {
    try {
        const { name, phone, email, address } = req.body;
        if (!name || !phone) {
            return res.status(400).json({ success: false, message: 'Name and phone are required' });
        }
        const existing = await customer_model_1.Customer.findOne({ phone });
        if (existing) {
            return res.status(400).json({ success: false, message: 'A customer with this phone number already exists' });
        }
        const customer = await customer_model_1.Customer.create({ name, phone, email, address });
        return res.status(201).json({ success: true, message: 'Customer created successfully', data: customer });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.createCustomer = createCustomer;
// GET /api/customers
const getCustomers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search;
        const query = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }
        const skip = (page - 1) * limit;
        const customers = await customer_model_1.Customer.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });
        const total = await customer_model_1.Customer.countDocuments(query);
        return res.status(200).json({
            success: true,
            data: customers,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.getCustomers = getCustomers;
// GET /api/customers/:id
const getCustomerById = async (req, res) => {
    try {
        const customer = await customer_model_1.Customer.findById(req.params.id);
        if (!customer) {
            return res.status(404).json({ success: false, message: 'Customer not found' });
        }
        return res.status(200).json({ success: true, data: customer });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.getCustomerById = getCustomerById;
// PATCH /api/customers/:id
const updateCustomer = async (req, res) => {
    try {
        const { name, phone, email, address } = req.body;
        const customer = await customer_model_1.Customer.findByIdAndUpdate(req.params.id, { name, phone, email, address }, { new: true, runValidators: true });
        if (!customer) {
            return res.status(404).json({ success: false, message: 'Customer not found' });
        }
        return res.status(200).json({ success: true, message: 'Customer updated successfully', data: customer });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateCustomer = updateCustomer;
// DELETE /api/customers/:id
const deleteCustomer = async (req, res) => {
    try {
        const customer = await customer_model_1.Customer.findByIdAndDelete(req.params.id);
        if (!customer) {
            return res.status(404).json({ success: false, message: 'Customer not found' });
        }
        return res.status(200).json({ success: true, message: 'Customer deleted successfully' });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.deleteCustomer = deleteCustomer;
