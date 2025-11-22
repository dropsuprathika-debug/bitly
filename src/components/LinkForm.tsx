'use client';
import { useState } from 'react';

export default function LinkForm() {
  const [url, setUrl] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, code }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage(`Short link created: ${window.location.origin}/${data.code}`);
      setUrl('');
      setCode('');
    } else {
      setMessage(data.error || 'Error');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={submit} className="mb-6">
      <div className="flex gap-2 mb-2">
        <input type="url" placeholder="Enter URL" value={url} onChange={e => setUrl(e.target.value)} className="border p-2 flex-1 rounded" required />
        <input type="text" placeholder="Custom code (optional)" value={code} onChange={e => setCode(e.target.value)} className="border p-2 w-40 rounded" />
        <button disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">{loading ? 'Loading...' : 'Create'}</button>
      </div>
      {message && <p className="text-sm">{message}</p>}
    </form>
  );
}
