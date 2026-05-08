import { v2 as cloudinary } from 'cloudinary';

const CLOUDINARY_URL =
  process.env.CLOUDINARY_URL ||
  'cloudinary://471718517745742:EKkm78GWRz8AurPeyhnvUSJtnK0@dbjfbmvmt';

cloudinary.config({ cloudinary_url: CLOUDINARY_URL });

export { cloudinary };
