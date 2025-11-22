'use client';
export default function LinkTable({ links }: { links: any[] }) {
  const deleteLink = async (code: string) => {
    await fetch(`/api/links/${code}`, { method: 'DELETE' });
    window.location.reload();
  };

  return (
    <table className="w-full border-collapse border text-sm">
      <thead>
        <tr className="bg-gray-100 text-left">
          <th className="p-2">Code</th>
          <th className="p-2">URL</th>
          <th className="p-2">Clicks</th>
          <th className="p-2">Last Click</th>
          <th className="p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {links.map(link => (
          <tr key={link.code} className="border-t">
            <td className="p-2 font-mono">{link.code}</td>
            <td className="p-2 truncate max-w-xs">{link.url}</td>
            <td className="p-2">{link.clicks}</td>
            <td className="p-2">{link.lastClicked ? new Date(link.lastClicked).toLocaleString() : '-'}</td>
            <td className="p-2">
              <button onClick={() => deleteLink(link.code)} className="text-red-500 hover:underline">Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
