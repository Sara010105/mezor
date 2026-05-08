import mongoose from 'mongoose';

export interface IJewelry {
  name: string;
  price: number;
  description: string;
  category: string;
  mainImage: string;
  transparentImage: string;
}

const jewelrySchema = new mongoose.Schema<IJewelry>(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true, lowercase: true },
    mainImage: { type: String, required: true, trim: true },
    transparentImage: { type: String, required: true, trim: true },
  },
  { timestamps: true, collection: 'jewelries' },
);

export const Jewelry =
  mongoose.models.Jewelry || mongoose.model<IJewelry>('Jewelry', jewelrySchema);
