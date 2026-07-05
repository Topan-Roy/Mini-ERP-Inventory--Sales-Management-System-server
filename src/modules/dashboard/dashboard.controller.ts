import { Request, Response } from 'express';
import { Product } from '../products/product.model';
import { Sale } from '../sales/sale.model';
import { Customer } from '../customers/customer.model';

// GET /api/dashboard/stats
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalCustomers = await Customer.countDocuments();

    // Total sales amount and count
    const totalSalesAggr = await Sale.aggregate([
      { $group: { _id: null, totalAmount: { $sum: '$totalAmount' }, count: { $sum: 1 } } },
    ]);
    const totalSalesAmount = totalSalesAggr.length > 0 ? totalSalesAggr[0].totalAmount : 0;
    const totalSalesCount = totalSalesAggr.length > 0 ? totalSalesAggr[0].count : 0;

    // Low stock products (stock < 5)
    const lowStockProducts = await Product.find({ stockQuantity: { $lt: 5 } })
      .select('name sku stockQuantity productImage category')
      .limit(10);

    // Recent sales (last 5)
    const recentSales = await Sale.find()
      .populate('customer', 'name phone')
      .populate('soldBy', 'name')
      .select('invoiceNo customer totalAmount createdAt soldBy')
      .sort({ createdAt: -1 })
      .limit(5);

    // Monthly sales chart data (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const salesChartData = await Sale.aggregate([
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
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
