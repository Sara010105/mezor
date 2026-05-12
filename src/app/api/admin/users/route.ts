import { Utilisateur } from '../../../../../models/Utilisateur';
import { Commande } from '../../../../../models/Commande';
import { connectDatabase } from '../../../../../server/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDatabase();
    const [users, orders] = await Promise.all([
      Utilisateur.find().sort({ creeLe: -1 }),
      Commande.find()
    ]);
    
    const usersWithStats = users.map(user => {
      const userOrders = orders.filter(o => o.utilisateurId.toString() === user._id.toString());
      const totalSpent = userOrders.reduce((sum, o) => sum + (o.montantTotal || 0), 0);
      return {
        ...user.toObject(),
        totalSpent
      };
    });

    return Response.json(usersWithStats);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    await connectDatabase();
    const { id, isAdmin } = await request.json();
    const updatedUser = await Utilisateur.findByIdAndUpdate(id, { role: isAdmin ? 'admin' : 'client' }, { new: true });
    return Response.json(updatedUser);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
