import { Bijou } from '../../../../../models/Bijou';
import { connectDatabase } from '../../../../../server/db';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDatabase();
    const body = await request.json();
    const updatedBijou = await Bijou.findByIdAndUpdate(id, body, {
      new: true,
    });
    return Response.json(updatedBijou);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDatabase();
    await Bijou.findByIdAndDelete(id);
    return Response.json({ success: true });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
