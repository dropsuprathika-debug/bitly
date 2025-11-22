import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';


export async function GET(_: Request, { params }: { params: { code: string } }) {
  const link = await prisma.links.findUnique({ where: { code: params.code } });
  if (!link) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(link);
}

export async function DELETE(_: Request, { params }: { params: { code: string } }) {
  const existing = await prisma.links.findUnique({ where: { code: params.code } });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  await prisma.link.delete({ where: { code: params.code } });
  return NextResponse.json({ deleted: true });
}
