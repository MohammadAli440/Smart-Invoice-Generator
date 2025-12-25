'use client';
import React, { useMemo, useState } from 'react';
import toast from 'react-hot-toast';

export default function InvoiceList({ invoices: initial = [], onDelete }: { invoices: any[]; onDelete?: (id: string) => void }) {
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | 'all'>('all');
  const [page, setPage] = useState(1);
  const perPage = 10;

  const filtered = useMemo(() => {
    let items = initial;
    if (statusFilter !== 'all') items = items.filter((i) => i.status === statusFilter);
    if (q) {
      const fq = q.toLowerCase();
      items = items.filter((i) => (i.invoiceNumber || '').toLowerCase().includes(fq) || (i.client?.name || '').toLowerCase().includes(fq) || (i.client?.email || '').toLowerCase().includes(fq));
    }
    return items;
  }, [initial, q, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this invoice?')) return;
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      const res = await fetch(`/api/invoices/${id}`, { method: 'DELETE', headers: token ? { Authorization: `Bearer ${token}` } : {} });
      if (!res.ok) throw new Error('Delete failed');
      toast.success('Deleted');
      onDelete && onDelete(id);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || 'Delete failed');
    }
  };

  return (
    <div className="bg-white rounded shadow p-4">
      <div className="flex gap-2 items-center mb-4">
        <input className="border p-2 rounded flex-1" placeholder="Search by invoice, client or email" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="border p-2 rounded" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)}>
          <option value="all">All</option>
          <option value="Draft">Draft</option>
          <option value="Sent">Sent</option>
          <option value="Paid">Paid</option>
        </select>
      </div>

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="text-left">
            <th className="border p-2">#</th>
            <th className="border p-2">Client</th>
            <th className="border p-2">Date</th>
            <th className="border p-2 text-right">Total</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pageItems.map((it) => (
            <tr key={it._id}>
              <td className="border p-2">{it.invoiceNumber}</td>
              <td className="border p-2">{it.client?.name} <div className="text-sm text-gray-500">{it.client?.email}</div></td>
              <td className="border p-2">{new Date(it.date).toLocaleDateString()}</td>
              <td className="border p-2 text-right">₹{Number(it.total || 0).toFixed(2)}</td>
              <td className="border p-2"><span className={`px-2 py-1 rounded ${it.status==='Paid'?'bg-green-100 text-green-700': it.status==='Sent'?'bg-yellow-100 text-yellow-700':'bg-gray-100 text-gray-700'}`}>{it.status}</span></td>
              <td className="border p-2">
                <div className="flex gap-2">
                  <a href={`/invoices/${it._id}`} className="text-blue-600">View</a>
                  <a href={`/invoices/${it._id}/edit`} className="text-indigo-600">Edit</a>
                  <button onClick={() => handleDelete(it._id)} className="text-red-600">Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-gray-500">Showing {pageItems.length} of {filtered.length}</div>
        <div className="flex gap-2">
          <button disabled={page<=1} onClick={() => setPage(page-1)} className="px-2 py-1 border rounded">Prev</button>
          <div className="px-2 py-1 border rounded">{page}/{totalPages}</div>
          <button disabled={page>=totalPages} onClick={() => setPage(page+1)} className="px-2 py-1 border rounded">Next</button>
        </div>
      </div>
    </div>
  );
}
