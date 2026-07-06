"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getProducts = exports.createProduct = void 0;
const product_model_1 = require("./product.model");
const createProduct = async (req, res) => {
    try {
        const { name, sku, category, purchasePrice, sellingPrice, stockQuantity } = req.body;
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Product image is required' });
        }
        const productImage = `/uploads/${req.file.filename}`;
        const newProduct = await product_model_1.Product.create({
            name, sku, category, purchasePrice, sellingPrice, stockQuantity, productImage
        });
        res.status(201).json({ success: true, message: 'Product created', data: newProduct });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.createProduct = createProduct;
const getProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search;
        const query = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { sku: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } }
            ];
        }
        const skip = (page - 1) * limit;
        const products = await product_model_1.Product.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });
        const total = await product_model_1.Product.countDocuments(query);
        res.status(200).json({
            success: true,
            data: products,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getProducts = getProducts;
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };
        if (req.file) {
            updateData.productImage = `/uploads/${req.file.filename}`;
        }
        const updatedProduct = await product_model_1.Product.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.status(200).json({ success: true, message: 'Product updated', data: updatedProduct });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await product_model_1.Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.status(200).json({ success: true, message: 'Product deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.deleteProduct = deleteProduct;
