import { Bijou } from '../../../../models/Bijou';
import { connectDatabase } from '../../../../server/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDatabase();
    const bijoux = await Bijou.find().sort({ creeLe: -1 });
    
    // Support both French (Admin) and English (Public) field names
    const transformedBijoux = bijoux.map(b => {
      const obj = b.toObject();
      return {
        ...obj,
        name: obj.nom,
        price: obj.prix,
        category: obj.categorie,
        imagesFinitions: obj.imagesFinitions,
        transparentImage: obj.imageTransparente
      };
    });

    return Response.json(transformedBijoux);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDatabase();
    const body = await request.json();
    const nouveauBijou = await Bijou.create(body);
    return Response.json(nouveauBijou, { status: 201 });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
