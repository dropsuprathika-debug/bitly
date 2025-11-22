import { redirect } from 'next/navigation';
import { prisma } from '../../../lib/prisma';

export default async function RedirectPage(props: { params: Promise<{ code: string }> }) {
  const { code } = await props.params;

  // Find link by code
  const link = await prisma.links.findUnique({
    where: { code },
  });

  // If not found -> show 404-like page
  if (!link) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-700">
        <h1 className="text-2xl font-semibold mb-4">❌ Link not found</h1>
        <a href="/" className="text-blue-600 hover:underline">Go back to Dashboard</a>
      </div>
    );
  }

  // Update click count + last clicked time
  await prisma.links.update({
    where: { code },
    data: {
      clicks: { increment: 1 },
      lastClicked: new Date(),
    },
  });

  // Redirect to the target URL
  redirect(link.url);
}
