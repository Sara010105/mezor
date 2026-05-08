import mongoose from 'mongoose';

export interface IContactMessage {
  name: string;
  email: string;
  message: string;
}

const contactMessageSchema = new mongoose.Schema<IContactMessage>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    message: { type: String, required: true, trim: true },
  },
  { timestamps: true, collection: 'contact_messages' },
);

export const ContactMessage =
  mongoose.models.ContactMessage ||
  mongoose.model<IContactMessage>('ContactMessage', contactMessageSchema);
