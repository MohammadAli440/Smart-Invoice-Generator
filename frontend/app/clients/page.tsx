'use client';
import React, { useEffect, useState } from 'react';

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await fetch('/api/clients', { headers: token ? { Authorization: `Bearer ${token}` } : {} });
        if (!res.ok) throw new Error('Failed to load clients');
        const data = await res.json();
        setClients(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Clients</h1>
        <a href="/invoices/new" className="px-4 py-2 bg-blue-600 text-white rounded">Add Client</a>
      </div>
      {loading ? <div>Loading...</div> : (
        <div className="bg-white rounded shadow">
          <table className="w-full table-auto">
            <thead><tr><th className="p-2">Name</th><th className="p-2">Email</th><th className="p-2">Business</th></tr></thead>
            <tbody>{clients.map((c:any)=> <tr key={c._id}><td className="p-2">{c.name}</td><td className="p-2">{c.email}</td><td className="p-2">{c.businessName}</td></tr>)}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
