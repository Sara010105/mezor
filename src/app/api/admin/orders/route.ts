import { Commande } from '../../../../../models/Commande';
import { Utilisateur } from '../../../../../models/Utilisateur';
import { Bijou } from '../../../../../models/Bijou';
import { connectDatabase } from '../../../../../server/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDatabase();
    const orders = await Commande.find()
      .populate('utilisateurId', 'nomUtilisateur')
      .populate('articles.bijouId', 'nom')
      .sort({ creeLe: -1 });
    
    // Transform to match frontend expectations if necessary
    const transformedOrders = orders.map(order => ({
      ...order.toObject(),
      customer: (order.utilisateurId as any)?.nomUtilisateur || 'Unknown Customer',
      items: order.articles.map((a: any) => a.bijouId?.nom || 'Unknown Item'),
    }));

    return Response.json(transformedOrders);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectDatabase();
    const { id, statut } = await request.json();
    const updatedOrder = await Commande.findByIdAndUpdate(id, { statut }, { new: true });
    return Response.json(updatedOrder);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
