import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// Create new short link
export async function POST(req: Request) {
  try {
    const { url, code } = await req.json();

    if (!url || !/^https?:\/\//i.test(url)) {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    const shortCode = code || Math.random().toString(36).substring(2, 8);
    const existing = await prisma.links.findUnique({ where: { code: shortCode } });

    if (existing) {
      return NextResponse.json({ error: 'Code already exists' }, { status: 409 });
    }

    const link = await prisma.links.create({
      data: { url, code: shortCode },
    });

    return NextResponse.json(link);
  } catch (error) {
    console.error('Error creating link:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// Get all links
export async function GET() {
  const links = await prisma.links.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(links);
}

// Increment clicks + update lastClicked
export async function PUT(req: Request) {
  try {
    const { code } = await req.json();

    const updated = await prisma.links.update({
      where: { code },
      data: {
        clicks: { increment: 1 },
        lastClicked: new Date(),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating click:', error);
    return NextResponse.json({ error: 'Failed to update click' }, { status: 500 });
  }
}
