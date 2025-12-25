'use client';
import React, { useEffect, useState } from 'react';
import InvoiceActions from '../../../components/InvoiceActions';

export default function InvoicePage({ params }: { params: { id: string } }) {
  const id = params.id;
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [emailLogs, setEmailLogs] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await fetch(`/api/invoices/${id}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
        if (!res.ok) throw new Error('Failed to load invoice');
        const data = await res.json();
        setInvoice(data);

        // load email logs
        const logsRes = await fetch(`/api/invoices/${id}/email-logs`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
        if (logsRes.ok) {
          const logs = await logsRes.json();
          setEmailLogs(logs || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!invoice) return <div className="p-6">Invoice not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white p-6 rounded shadow">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold">{invoice.company?.name}</h2>
            <div className="text-sm">{invoice.company?.address}</div>
          </div>
          <div className="text-right">
            <div className="font-semibold">Invoice #{invoice.invoiceNumber}</div>
            <div className="text-sm">{new Date(invoice.date).toLocaleDateString()}</div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold">Bill To</h3>
          <div>{invoice.client?.name} {invoice.client?.businessName && `(${invoice.client.businessName})`}</div>
          <div>{invoice.client?.email}</div>
          <div>{invoice.client?.address}</div>
        </div>

        <table className="w-full mt-6 table-auto border-collapse">
          <thead>
            <tr className="text-left">
              <th className="border p-2">#</th>
              <th className="border p-2">Description</th>
              <th className="border p-2 text-right">Qty</th>
              <th className="border p-2 text-right">Price</th>
              <th className="border p-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((it: any) => (
              <tr key={it._id || it.no}>
                <td className="border p-2">{it.no}</td>
                <td className="border p-2">{it.description}</td>
                <td className="border p-2 text-right">{it.quantity}</td>
                <td className="border p-2 text-right">{it.price}</td>
                <td className="border p-2 text-right">{it.total}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 text-right">
          <div>Subtotal: ₹{invoice.subtotal}</div>
          <div>Tax: ₹{invoice.tax}</div>
          <div>Discount: ₹{invoice.discount}</div>
          <div className="text-lg font-bold">Total: ₹{invoice.total}</div>
        </div>

        <div className="mt-6">
          <div className="text-sm text-gray-600">Notes: {invoice.notes}</div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="bg-white p-3 rounded shadow">
            <div className="text-sm text-gray-500">Sends</div>
            <div className="text-xl font-semibold">{emailLogs.length}</div>
          </div>
          <div className="bg-white p-3 rounded shadow">
            <div className="text-sm text-gray-500">Opens</div>
            <div className="text-xl font-semibold">{emailLogs.reduce((a,b)=>a+(b.openCount||0),0)}</div>
          </div>
          <div className="bg-white p-3 rounded shadow">
            <div className="text-sm text-gray-500">Clicks</div>
            <div className="text-xl font-semibold">{emailLogs.reduce((a,b)=>a+(b.clickCount||0),0)}</div>
          </div>
        </div>
      </div>

      <InvoiceActions invoiceId={id} clientEmail={invoice.client?.email} invoiceNumber={invoice.invoiceNumber} />
    </div>
  );
}
