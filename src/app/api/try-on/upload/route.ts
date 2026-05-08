import { cloudinary } from '../../../../../server/cloudinary';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('photo');

  if (!(file instanceof File)) {
    return Response.json({ error: 'No image file provided.' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const dataUri = `data:${file.type};base64,${buffer.toString('base64')}`;

  const uploaded = await cloudinary.uploader.upload(dataUri, {
    folder: 'mezor/try-on',
    resource_type: 'image',
  });

  return Response.json(
    {
      success: true,
      secureUrl: uploaded.secure_url,
      publicId: uploaded.public_id,
    },
    { status: 201 },
  );
}

