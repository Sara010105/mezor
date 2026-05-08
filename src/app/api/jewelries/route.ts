import { Jewelry } from '../../../../models/Jewelry';
import { connectDatabase } from '../../../../server/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  await connectDatabase();
  const jewelries = await Jewelry.find().sort({ createdAt: -1 });
  return Response.json(jewelries);
}

