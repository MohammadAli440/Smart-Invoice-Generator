'use client';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [body, setBody] = useState('');

  const load = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch('/api/templates', { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      if (!res.ok) throw new Error('Failed');
      setTemplates(await res.json());
    } catch (err) { console.error(err); toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const create = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch('/api/templates', { method: 'POST', headers: { 'Content-Type':'application/json', ...(token?{ Authorization:`Bearer ${token}` }: {}) }, body: JSON.stringify({ name, body }) });
      if (!res.ok) throw new Error('Failed');
      toast.success('Created');
      setName(''); setBody(''); load();
    } catch (err) { console.error(err); toast.error('Failed'); }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Email Templates</h1>
      <div className="bg-white rounded shadow p-4 mb-4">
        <input className="w-full border p-2 mb-2" placeholder="Name" value={name} onChange={(e:any)=>setName(e.target.value)} />
        <textarea className="w-full border p-2 mb-2" placeholder="Body (use {{client.name}} etc)" value={body} onChange={(e:any)=>setBody(e.target.value)} rows={6} />
        <div className="flex justify-end"><button onClick={create} className="px-4 py-2 bg-green-600 text-white rounded">Create</button></div>
      </div>
      {loading ? <div>Loading...</div> : (
        <div className="bg-white rounded shadow p-4">
          <ul>{templates.map(t=> <li key={t._id} className="border-b py-2"><div className="font-semibold">{t.name}</div><div className="text-sm text-gray-600">{t.body}</div></li>)}</ul>
        </div>
      )}
    </div>
  );
}
