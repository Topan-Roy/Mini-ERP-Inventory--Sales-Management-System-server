"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSaleById = exports.getSales = exports.createSale = void 0;
const sale_model_1 = require("./sale.model");
const product_model_1 = require("../products/product.model");
const mongoose_1 = __importDefault(require("mongoose"));
// POST /api/sales — Create a new sale with stock deduction
const createSale = async (req, res) => {
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const { items, customerId } = req.body; // items: [{ productId, quantity }], customerId?: optional
        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: 'No products in the sale' });
        }
        let totalAmount = 0;
        const saleItems = [];
        for (const item of items) {
            const product = await product_model_1.Product.findById(item.productId).session(session);
            if (!product) {
                throw new Error(`Product with ID ${item.productId} not found`);
            }
            if (product.stockQuantity < item.quantity) {
                throw new Error(`Insufficient stock for "${product.name}". Available: ${product.stockQuantity}`);
            }
            // Deduct stock
            product.stockQuantity -= item.quantity;
            await product.save({ session });
            const itemTotal = product.sellingPrice * item.quantity;
            totalAmount += itemTotal;
            saleItems.push({
                product: product._id,
                quantity: item.quantity,
                price: product.sellingPrice,
            });
        }
        const saleData = {
            items: saleItems,
            totalAmount,
            soldBy: req.user._id,
        };
        if (customerId) {
            saleData.customer = customerId;
        }
        const sale = await sale_model_1.Sale.create([saleData], { session });
        await session.commitTransaction();
        session.endSession();
        // Re-fetch with populated fields
        const populated = await sale_model_1.Sale.findById(sale[0]._id)
            .populate('customer', 'name phone email')
            .populate('items.product', 'name sku sellingPrice')
            .populate('soldBy', 'name email role');
        return res.status(201).json({ success: true, message: 'Sale created successfully', data: populated });
    }
    catch (error) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ success: false, message: error.message });
    }
};
exports.createSale = createSale;
// GET /api/sales — Get all sales (with search, date filter, pagination)
const getSales = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search;
        const date = req.query.date;
        const query = {};
        if (search) {
            query.invoiceNo = { $regex: search, $options: 'i' };
        }
        if (date) {
            const start = new Date(date);
            start.setHours(0, 0, 0, 0);
            const end = new Date(date);
            end.setHours(23, 59, 59, 999);
            query.createdAt = { $gte: start, $lte: end };
        }
        const skip = (page - 1) * limit;
        const sales = await sale_model_1.Sale.find(query)
            .populate('customer', 'name phone')
            .populate('items.product', 'name sku')
            .populate('soldBy', 'name role')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        const total = await sale_model_1.Sale.countDocuments(query);
        return res.status(200).json({
            success: true,
            data: sales,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.getSales = getSales;
// GET /api/sales/:id — Get single sale details (Invoice)
const getSaleById = async (req, res) => {
    try {
        const sale = await sale_model_1.Sale.findById(req.params.id)
            .populate('customer', 'name phone email address')
            .populate('items.product', 'name sku sellingPrice productImage')
            .populate('soldBy', 'name email role');
        if (!sale) {
            return res.status(404).json({ success: false, message: 'Sale not found' });
        }
        return res.status(200).json({ success: true, data: sale });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.getSaleById = getSaleById;
