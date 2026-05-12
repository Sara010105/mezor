import { Bijou } from '../../../../../models/Bijou';
import { Commande } from '../../../../../models/Commande';
import { Utilisateur } from '../../../../../models/Utilisateur';
import { connectDatabase } from '../../../../../server/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDatabase();
    
    const totalProducts = await Bijou.countDocuments();
    const orders = await Commande.find();
    const users = await Utilisateur.find();
    
    const totalRevenue = orders.reduce((sum, order) => sum + (order.montantTotal || 0), 0);
    const activeOrders = orders.filter((o) => o.statut !== 'annulée').length;
    const totalCustomers = users.length;
    
    // Mock sales data for the chart if no real data exists
    const salesData = [
      { month: 'Jan', revenue: 45000 },
      { month: 'Feb', revenue: 52000 },
      { month: 'Mar', revenue: 48000 },
      { month: 'Apr', revenue: 61000 },
      { month: 'May', revenue: 55000 },
      { month: 'Jun', revenue: 67000 },
    ];

    return Response.json({
      totalProducts,
      totalRevenue,
      activeOrders,
      totalCustomers,
      salesData
    });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
