import mongoose from 'mongoose';

export interface IOrder {
  customer: string;
  items: string[];
  total: number;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Cancelled';
  date: string;
}

const orderSchema = new mongoose.Schema<IOrder>(
  {
    customer: { type: String, required: true },
    items: { type: [String], required: true },
    total: { type: Number, required: true },
    status: { 
      type: String, 
      required: true, 
      enum: ['Pending', 'Confirmed', 'Shipped', 'Cancelled'],
      default: 'Pending'
    },
    date: { type: String, required: true },
  },
  { timestamps: true }
);

export const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema);
