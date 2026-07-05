import mongoose, { Schema, Document } from 'mongoose';

export interface ISaleItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
  price: number; // Selling price at the time of sale
}

export interface ISale extends Document {
  invoiceNo: string;
  customer?: mongoose.Types.ObjectId; // Optional (walk-in customer)
  items: ISaleItem[];
  totalAmount: number;
  soldBy: mongoose.Types.ObjectId;
}

const SaleSchema: Schema = new Schema({
  invoiceNo: { type: String, unique: true },
  customer: { type: Schema.Types.ObjectId, ref: 'Customer', default: null },
  items: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
  }],
  totalAmount: { type: Number, required: true },
  soldBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

// Auto-generate invoiceNo before saving
SaleSchema.pre('save', async function (next) {
  if (this.isNew && !this.invoiceNo) {
    const count = await mongoose.model('Sale').countDocuments();
    this.invoiceNo = `INV-${String(count + 1).padStart(3, '0')}`;
  }
  next();
});

export const Sale = mongoose.model<ISale>('Sale', SaleSchema);
