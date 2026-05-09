import { Jewelry } from '../../../../../models/Jewelry';
import { connectDatabase } from '../../../../../server/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  await connectDatabase();
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';

  if (!query) {
    const jewelries = await Jewelry.find().sort({ createdAt: -1 });
    return Response.json(jewelries);
  }

  // Handle specific category mapping from prompt
  let categoryFilter = query.toLowerCase();
  if (categoryFilter.includes('neck')) categoryFilter = 'necklaces';
  else if (categoryFilter.includes('hand')) categoryFilter = 'rings';
  else if (categoryFilter.includes('foot')) categoryFilter = 'earrings';

  const jewelries = await Jewelry.find({
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { category: { $regex: categoryFilter, $options: 'i' } },
      { category: { $regex: query, $options: 'i' } }
    ]
  }).sort({ createdAt: -1 });

  return Response.json(jewelries);
}
