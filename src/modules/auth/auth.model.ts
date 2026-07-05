import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'Admin' | 'Manager' | 'Employee';
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Optional since previous auth might be social or just plain token based
  role: { type: String, enum: ['Admin', 'Manager', 'Employee'], default: 'Employee' },
}, { timestamps: true });

export const User = mongoose.model<IUser>('User', UserSchema);
