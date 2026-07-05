import { Request, Response } from 'express';
import { Product } from '../products/product.model';
import { Sale } from '../sales/sale.model';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const totalProducts = await Product.countDocuments();
    
    const totalSalesAggr = await Sale.aggregate([
      { $group: { _id: null, totalAmount: { $sum: "$totalAmount" }, count: { $sum: 1 } } }
    ]);
    const totalSalesAmount = totalSalesAggr.length > 0 ? totalSalesAggr[0].totalAmount : 0;
    const totalSalesCount = totalSalesAggr.length > 0 ? totalSalesAggr[0].count : 0;

    const lowStockProducts = await Product.find({ stockQuantity: { $lt: 5 } }).select('name sku stockQuantity');

    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        totalSalesAmount,
        totalSalesCount,
        lowStockProducts
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
