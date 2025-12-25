'use client';
import React, { useEffect, useState } from 'react';

export default function EmailLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await fetch('/api/email/logs', { headers: token ? { Authorization: `Bearer ${token}` } : {} });
        if (!res.ok) throw new Error('Failed to load logs');
        const data = await res.json();
        setLogs(data || []);
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
      <h1 className="text-2xl font-bold mb-4">Email Logs</h1>
      {loading ? <div>Loading...</div> : (
        <div className="bg-white rounded shadow p-4">
          <table className="w-full">
            <thead><tr><th className="p-2">Invoice</th><th className="p-2">To</th><th className="p-2">Sent</th><th className="p-2">Opens</th><th className="p-2">Clicks</th></tr></thead>
            <tbody>{logs.map(l => (
              <tr key={l._id}><td className="p-2">{l.invoiceId}</td><td className="p-2">{l.to}</td><td className="p-2">{l.sentAt ? new Date(l.sentAt).toLocaleString() : '-'}</td><td className="p-2">{l.openCount || 0}</td><td className="p-2">{l.clickCount || 0}</td></tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
