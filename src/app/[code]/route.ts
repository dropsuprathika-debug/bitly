import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';


export async function GET(
  _req: Request,
  context: { params: Promise<{ code: string }> }
) {
  const { code } = await context.params;

  const link = await prisma.links.findUnique({
    where: { code },
  });

  if (!link) {
    return NextResponse.redirect(new URL("/", _req.url));
  }

  // increment click count
  await prisma.links.update({
    where: { code },
    data: { clicks: { increment: 1 }, lastClicked: new Date() },
  });

  return NextResponse.redirect(link.url);
}
