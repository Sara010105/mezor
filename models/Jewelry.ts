import mongoose from 'mongoose';

export interface IJewelry {
  name: string;
  price: number;
  description: string;
  category: string;
  mainImage: string;
  transparentImage: string;
  material?: string;
  stock?: number;
}

const jewelrySchema = new mongoose.Schema<IJewelry>(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true, lowercase: true },
    mainImage: { type: String, required: true, trim: true },
    transparentImage: { type: String, trim: true, default: '' },
    material: { type: String, trim: true },
    stock: { type: Number, default: 0 },
  },
  { timestamps: true, collection: 'jewelries' },
);

export const Jewelry =
  mongoose.models.Jewelry || mongoose.model<IJewelry>('Jewelry', jewelrySchema);
