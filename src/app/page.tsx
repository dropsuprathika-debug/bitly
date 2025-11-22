"use client";
import { useState, useEffect } from 'react';
import { Loader2, Copy, Trash2, Link as LinkIcon, BarChart3 } from 'lucide-react';

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [url, setUrl] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchLinks();
    const interval = setInterval(fetchLinks, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchLinks = async () => {
    const res = await fetch('/api/links');
    const data = await res.json();
    setLinks(data);
  };

  const createLink = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!/^https?:\/\//i.test(url)) {
      setMessage('❌ Please enter a valid URL starting with http or https');
      setLoading(false);
      return;
    }

    const res = await fetch('/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, code }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage(`✅ Short link created: ${window.location.origin}/${data.code}`);
      setUrl('');
      setCode('');
      fetchLinks();
    } else {
      setMessage(`❌ ${data.error}`);
    }

    setLoading(false);
  };

  const deleteLink = async (shortCode) => {
    await fetch(`/api/links/${shortCode}`, { method: 'DELETE' });
    fetchLinks();
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setMessage(`📋 Copied ${text}`);
  };

  const handleLinkClick = async (link) => {
    try {
      await fetch('/api/links', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: link.code }),
      });

      window.open(link.url, '_blank');
      fetchLinks();
    } catch (error) {
      console.error('Error updating click:', error);
    }
  };

  const filteredLinks = links.filter(
    (l) =>
      l.code.toLowerCase().includes(filter.toLowerCase()) ||
      l.url.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-800 font-sans">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-blue-400 to-blue-500 text-white shadow-lg p-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-8 flex items-center gap-2">
          <LinkIcon className="w-6 h-6" /> TinyLink
        </h1>
        <nav className="space-y-4">
          <a href="/" className="block font-medium hover:text-blue-100">Dashboard</a>
          <a href="/healthz" className="block font-medium hover:text-blue-100">Healthcheck</a>
        </nav>
        <div className="mt-auto pt-8 text-sm text-blue-100">
          © {new Date().getFullYear()} TinyLink
        </div>
      </aside>

      {/* Main Content */}
      <div className="ml-64 flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="bg-white border-b shadow-sm px-8 py-4 flex justify-between items-center sticky top-0 z-10">
          <input
            type="text"
            placeholder="Search links..."
            className="px-3 py-2 border border-gray-300 rounded-lg w-72 focus:ring focus:ring-blue-200"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
            U
          </div>
        </header>

        <main className="flex-1 px-8 py-8 space-y-8 w-full">
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Links</p>
                <h2 className="text-3xl font-bold text-gray-700">{links.length}</h2>
              </div>
              <BarChart3 className="w-10 h-10 text-blue-500" />
            </div>
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Clicks</p>
                <h2 className="text-3xl font-bold text-gray-700">
                  {links.reduce((sum, l) => sum + l.clicks, 0)}
                </h2>
              </div>
              <LinkIcon className="w-10 h-10 text-blue-500" />
            </div>
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Codes</p>
                <h2 className="text-3xl font-bold text-gray-700">
                  {links.filter((l) => l.clicks > 0).length}
                </h2>
              </div>
              <Loader2 className="w-10 h-10 text-blue-500" />
            </div>
          </section>

          <form
            onSubmit={createLink}
            className="bg-white p-6 rounded-xl shadow flex flex-wrap gap-4 items-center hover:shadow-md transition"
          >
            <input
              type="url"
              placeholder="Enter a long URL"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Custom code (optional)"
              className="w-48 border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Create"}
            </button>
          </form>

          {message && (
            <div className="text-center text-sm font-medium text-gray-700">{message}</div>
          )}

          <section className="bg-white p-6 rounded-xl shadow hover:shadow-md transition overflow-x-auto">
            {filteredLinks.length === 0 ? (
              <div className="text-center text-gray-500 py-10">
                No links found. Add a new one above.
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-100 border-b text-gray-600">
                  <tr>
                    <th className="p-3 text-left">Code</th>
                    <th className="p-3 text-left">Target URL</th>
                    <th className="p-3 text-left">Clicks</th>
                    <th className="p-3 text-left">Last Clicked</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLinks.map((link) => (
                    <tr key={link.code} className="border-b hover:bg-gray-50 transition">
                      <td
                        className="p-3 font-mono text-blue-700 cursor-pointer"
                        onClick={() =>
                          copyToClipboard(`${window.location.origin}/${link.code}`)
                        }
                      >
                        {link.code}
                      </td>
                      <td
                        className="p-3 truncate max-w-xs text-blue-600 cursor-pointer hover:underline"
                        onClick={() => handleLinkClick(link)}
                      >
                        {link.url}
                      </td>
                      <td className="p-3 text-center">{link.clicks}</td>
                      <td className="p-3 text-gray-500">
                        {link.lastClicked
                          ? new Date(link.lastClicked).toLocaleString()
                          : "Never"}
                      </td>
                      <td className="p-3 text-center space-x-2">
                        <button
                          onClick={() =>
                            copyToClipboard(`${window.location.origin}/${link.code}`)
                          }
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
                        >
                          <Copy className="w-4 h-4" /> Copy
                        </button>
                        <a
                          href={`/code/${link.code}`}
                          className="inline-flex items-center gap-1 text-green-600 hover:text-green-800"
                        >
                          <BarChart3 className="w-4 h-4" /> Stats
                        </a>
                        <button
                          onClick={() => deleteLink(link.code)}
                          className="inline-flex items-center gap-1 text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
