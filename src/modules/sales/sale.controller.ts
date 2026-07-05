import { Request, Response } from 'express';
import { Sale } from './sale.model';
import { Product } from '../products/product.model';
import { AuthRequest } from '../../middlewares/auth';
import mongoose from 'mongoose';

export const createSale = async (req: AuthRequest, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { items } = req.body; // Array of { productId, quantity }

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
        throw new Error(`Insufficient stock for product ${product.name}`);
      }

      // Reduce stock
      product.stockQuantity -= item.quantity;
      await product.save({ session });

      // Calculate total
      const itemTotal = product.sellingPrice * item.quantity;
      totalAmount += itemTotal;

      saleItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.sellingPrice
      });
    }

    const sale = await Sale.create([{
      items: saleItems,
      totalAmount,
      soldBy: req.user._id
    }], { session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ success: true, message: 'Sale created successfully', data: sale[0] });
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ success: false, message: error.message });
  }
};
