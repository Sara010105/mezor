import { Bijou } from '../../../../../models/Bijou';
import { connectDatabase } from '../../../../../server/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    await connectDatabase();
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';

    let bijoux;
    if (!query) {
      bijoux = await Bijou.find().sort({ creeLe: -1 });
    } else {
      // Handle specific category mapping
      let categoryFilter = query.toLowerCase();
      if (categoryFilter.includes('neck')) categoryFilter = 'colliers';
      else if (categoryFilter.includes('hand')) categoryFilter = 'bagues';
      else if (categoryFilter.includes('foot')) categoryFilter = 'boucles';

      bijoux = await Bijou.find({
        $or: [
          { nom: { $regex: query, $options: 'i' } },
          { categorie: { $regex: categoryFilter, $options: 'i' } },
          { categorie: { $regex: query, $options: 'i' } }
        ]
      }).sort({ creeLe: -1 });
    }

    const transformedBijoux = bijoux.map(b => {
      const obj = b.toObject();
      return {
        ...obj,
        name: obj.nom,
        price: obj.prix,
        category: obj.categorie,
        mainImage: obj.imagePrincipale,
        transparentImage: obj.imageTransparente
      };
    });

    return Response.json(transformedBijoux);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
