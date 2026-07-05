import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomer extends Document {
  name: string;
  phone: string;
  email?: string;
  address?: string;
}

const CustomerSchema: Schema = new Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, unique: true, trim: true },
  email: { type: String, trim: true, lowercase: true },
  address: { type: String, trim: true },
}, { timestamps: true });

export const Customer = mongoose.model<ICustomer>('Customer', CustomerSchema);
