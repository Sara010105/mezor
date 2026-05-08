import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import { ContactMessage } from '../models/ContactMessage';
import { Jewelry } from '../models/Jewelry';
import { cloudinary } from './cloudinary';
import { connectDatabase } from './db';

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const PORT = Number(process.env.PORT || 4000);

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', async (_req, res) => {
  await connectDatabase();
  res.json({ ok: true });
});

app.get('/api/jewelries', async (_req, res) => {
  await connectDatabase();
  const jewelries = await Jewelry.find().sort({ createdAt: -1 });
  res.json(jewelries);
});

app.post('/api/contact', async (req, res) => {
  await connectDatabase();
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email and message are required.' });
  }

  const created = await ContactMessage.create({ name, email, message });
  return res.status(201).json({ success: true, id: created._id });
});

app.post('/api/try-on/upload', upload.single('photo'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided.' });
  }

  const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
  const uploaded = await cloudinary.uploader.upload(dataUri, {
    folder: 'mezor/try-on',
    resource_type: 'image',
  });

  return res.status(201).json({
    success: true,
    secureUrl: uploaded.secure_url,
    publicId: uploaded.public_id,
  });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Mezor API running on http://localhost:${PORT}`);
});
