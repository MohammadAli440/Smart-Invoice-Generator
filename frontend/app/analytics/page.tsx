'use client';
import React, { useEffect, useState } from 'react';

export default function AnalyticsPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await fetch('/api/invoices', { headers: token ? { Authorization: `Bearer ${token}` } : {} });
        if (!res.ok) throw new Error('Failed to load');
        const data = await res.json();
        setInvoices(data || []);
      } catch (err) {
        console.error(err);
      } finally { setLoading(false); }
    }
    load();
  }, []);

  const totalRevenue = invoices.reduce((acc:any, inv:any) => acc + Number(inv.total || 0), 0);
  const sent = invoices.filter(i=>i.status==='Sent').length;
  const paid = invoices.filter(i=>i.status==='Paid').length;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Analytics</h1>
      {loading ? <div>Loading...</div> : (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded shadow"><div className="text-sm text-gray-500">Revenue</div><div className="text-xl font-semibold">₹{totalRevenue}</div></div>
          <div className="bg-white p-4 rounded shadow"><div className="text-sm text-gray-500">Sent</div><div className="text-xl font-semibold">{sent}</div></div>
          <div className="bg-white p-4 rounded shadow"><div className="text-sm text-gray-500">Paid</div><div className="text-xl font-semibold">{paid}</div></div>
        </div>
      )}
    </div>
  );
}
