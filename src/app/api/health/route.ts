import { connectDatabase } from '../../../../server/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  await connectDatabase();
  return Response.json({ ok: true });
}

