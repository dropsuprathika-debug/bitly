import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { code: string } }
) {
  try {
    console.log('Redirecting for code:', params.code);

    const link = await prisma.link.findUnique({
      where: { code: params.code },
    });

    if (!link) {
      console.error('No link found for code:', params.code);
      return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }

    // Update clicks + timestamp
    await prisma.link.update({
      where: { code: params.code },
      data: {
        clicks: { increment: 1 },
        lastClicked: new Date(),
      },
    });

    console.log(`Redirecting to ${link.url}`);
    return NextResponse.redirect(link.url);
  } catch (error) {
    console.error('Redirect route error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
