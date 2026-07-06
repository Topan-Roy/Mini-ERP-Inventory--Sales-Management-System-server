"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = void 0;
const product_model_1 = require("../products/product.model");
const sale_model_1 = require("../sales/sale.model");
const customer_model_1 = require("../customers/customer.model");
// GET /api/dashboard/stats
const getDashboardStats = async (req, res) => {
    try {
        const totalProducts = await product_model_1.Product.countDocuments();
        const totalCustomers = await customer_model_1.Customer.countDocuments();
        // Total sales amount and count
        const totalSalesAggr = await sale_model_1.Sale.aggregate([
            { $group: { _id: null, totalAmount: { $sum: '$totalAmount' }, count: { $sum: 1 } } },
        ]);
        const totalSalesAmount = totalSalesAggr.length > 0 ? totalSalesAggr[0].totalAmount : 0;
        const totalSalesCount = totalSalesAggr.length > 0 ? totalSalesAggr[0].count : 0;
        // Low stock products (stock < 5)
        const lowStockProducts = await product_model_1.Product.find({ stockQuantity: { $lt: 5 } })
            .select('name sku stockQuantity productImage category')
            .limit(10);
        // Recent sales (last 5)
        const recentSales = await sale_model_1.Sale.find()
            .populate('customer', 'name phone')
            .populate('soldBy', 'name')
            .select('invoiceNo customer totalAmount createdAt soldBy')
            .sort({ createdAt: -1 })
            .limit(5);
        // Monthly sales chart data (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);
        const salesChartData = await sale_model_1.Sale.aggregate([
            { $match: { createdAt: { $gte: sevenDaysAgo } } },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
                    },
                    totalSales: { $sum: '$totalAmount' },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);
        return res.status(200).json({
            success: true,
            data: {
                totalProducts,
                totalCustomers,
                totalSalesAmount,
                totalSalesCount,
                lowStockProducts,
                recentSales,
                salesChartData,
            },
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.getDashboardStats = getDashboardStats;
