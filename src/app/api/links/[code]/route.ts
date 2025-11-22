import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET(
  _req: Request,
  context: { params: Promise<{ code: string }> }
) {
  const { code } = await context.params;

  const link = await prisma.links.findUnique({
    where: { code },
  });

  if (!link) {
    return NextResponse.json({ error: "Link not found" }, { status: 404 });
  }

  return NextResponse.json(link);
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ code: string }> }
) {
  const { code } = await context.params;

  try {
    await prisma.links.delete({ where: { code } });
    return NextResponse.json({ message: "Link deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Error deleting link" }, { status: 500 });
  }
}
