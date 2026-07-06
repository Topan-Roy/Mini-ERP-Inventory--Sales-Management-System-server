import { Request, Response } from 'express';
import { Sale } from './sale.model';
import { Product } from '../products/product.model';
import { AuthRequest } from '../../middlewares/auth';
import mongoose from 'mongoose';

// POST /api/sales — Create a new sale with stock deduction
export const createSale = async (req: AuthRequest, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { items, customerId } = req.body; // items: [{ productId, quantity }], customerId?: optional

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No products in the sale' });
    }

    let totalAmount = 0;
    const saleItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId).session(session);

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

    const saleData: any = {
      items: saleItems,
      totalAmount,
      soldBy: req.user._id,
    };

    if (customerId) {
      saleData.customer = customerId;
    }

    // Generate invoiceNo manually because Sale.create() with a session array
    // does NOT trigger the pre('save') hook, leaving invoiceNo undefined.
    const count = await Sale.countDocuments().session(session);
    saleData.invoiceNo = `INV-${String(count + 1).padStart(3, '0')}`;

    const sale = await Sale.create([saleData], { session });

    await session.commitTransaction();
    session.endSession();

    // Re-fetch with populated fields
    const populated = await Sale.findById(sale[0]._id)
      .populate('customer', 'name phone email')
      .populate('items.product', 'name sku sellingPrice')
      .populate('soldBy', 'name email role');

    return res.status(201).json({ success: true, message: 'Sale created successfully', data: populated });
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    return res.status(400).json({ success: false, message: error.message });
  }
};

// GET /api/sales — Get all sales (with search, date filter, pagination)
export const getSales = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const date = req.query.date as string;

    const query: any = {};

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

    const sales = await Sale.find(query)
      .populate('customer', 'name phone')
      .populate('items.product', 'name sku')
      .populate('soldBy', 'name role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Sale.countDocuments(query);

    return res.status(200).json({
      success: true,
      data: sales,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/sales/:id — Get single sale details (Invoice)
export const getSaleById = async (req: Request, res: Response) => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate('customer', 'name phone email address')
      .populate('items.product', 'name sku sellingPrice productImage')
      .populate('soldBy', 'name email role');

    if (!sale) {
      return res.status(404).json({ success: false, message: 'Sale not found' });
    }

    return res.status(200).json({ success: true, data: sale });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
