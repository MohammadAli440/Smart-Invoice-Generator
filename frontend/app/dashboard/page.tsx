'use client';
import React, { useEffect, useState } from 'react';
import DashboardSummary from '../../components/DashboardSummary';
import InvoiceList from '../../components/InvoiceList';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await fetch('/api/invoices', { headers: token ? { Authorization: `Bearer ${token}` } : {} });
        if (!res.ok) throw new Error('Failed to load invoices');
        const data = await res.json();
        setInvoices(data);
      } catch (err: any) {
        console.error(err);
        toast.error(err?.message || 'Failed to load invoices');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const onDelete = (id: string) => {
    setInvoices((s) => s.filter((i) => i._id !== id));
  };

  if (loading) return <div className="p-6">Loading dashboard...</div>;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div>
            <a href="/invoices/new" className="px-4 py-2 bg-blue-600 text-white rounded">Create Invoice</a>
          </div>
        </div>

        <DashboardSummary invoices={invoices} />

        <InvoiceList invoices={invoices} onDelete={onDelete} />
      </div>
    </div>
  );
}
