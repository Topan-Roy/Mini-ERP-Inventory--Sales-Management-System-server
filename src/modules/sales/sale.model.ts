import mongoose, { Schema, Document } from 'mongoose';

export interface ISaleItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
  price: number; // Storing price at the time of sale
}

export interface ISale extends Document {
  items: ISaleItem[];
  totalAmount: number;
  soldBy: mongoose.Types.ObjectId;
}

const SaleSchema: Schema = new Schema({
  items: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
  }],
  totalAmount: { type: Number, required: true },
  soldBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export const Sale = mongoose.model<ISale>('Sale', SaleSchema);
