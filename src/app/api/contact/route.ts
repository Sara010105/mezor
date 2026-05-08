import { ContactMessage } from '../../../../models/ContactMessage';
import { connectDatabase } from '../../../../server/db';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  await connectDatabase();
  const { name, email, message } = await request.json();

  if (!name || !email || !message) {
    return Response.json({ error: 'Name, email and message are required.' }, { status: 400 });
  }

  const created = await ContactMessage.create({ name, email, message });
  return Response.json({ success: true, id: created._id }, { status: 201 });
}

