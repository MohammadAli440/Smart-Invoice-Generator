'use client';
import React, { useEffect, useState } from 'react';
import InvoiceList from '../../components/InvoiceList';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await fetch('/api/invoices', { headers: token ? { Authorization: `Bearer ${token}` } : {} });
        if (!res.ok) throw new Error('Failed to load invoices');
        const data = await res.json();
        setInvoices(data || []);
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
        <h1 className="text-2xl font-bold">Invoices</h1>
        <a href="/invoices/new" className="px-4 py-2 bg-blue-600 text-white rounded">Create Invoice</a>
      </div>
      {loading ? <div>Loading...</div> : <InvoiceList invoices={invoices} />}
    </div>
  );
}
