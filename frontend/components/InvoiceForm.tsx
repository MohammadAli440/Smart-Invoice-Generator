'use client';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ItemRow from './ItemRow';

export default function InvoiceForm() {
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | 'new'>('new');
  const [clientData, setClientData] = useState({ name: '', businessName: '', email: '', phone: '', website: '', address: '' });
  const [items, setItems] = useState([{ description: '', quantity: 1, price: 0 }]);
  const [tax, setTax] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadClients() {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await fetch('/api/clients', { headers: token ? { Authorization: `Bearer ${token}` } : {} });
        if (!res.ok) return;
        const data = await res.json();
        setClients(data);
      } catch (err) {
        console.error(err);
      }
    }
    loadClients();
  }, []);

  useEffect(() => {
    if (selectedClientId && selectedClientId !== 'new') {
      const c = clients.find((x) => x._id === selectedClientId);
      if (c) setClientData({ name: c.name || '', businessName: c.businessName || '', email: c.email || '', phone: c.phone || '', website: c.website || '', address: c.address || '' });
    } else {
      setClientData({ name: '', businessName: '', email: '', phone: '', website: '', address: '' });
    }
  }, [selectedClientId, clients]);

  const addRow = () => setItems((s) => [...s, { description: '', quantity: 1, price: 0 }]);
  const removeRow = (idx: number) => setItems((s) => s.filter((_, i) => i !== idx));
  const updateItem = (idx: number, field: string, value: any) => setItems((s) => s.map((it, i) => (i === idx ? { ...it, [field]: value } : it)));

  const subtotal = items.reduce((acc, it) => acc + (Number(it.quantity || 0) * Number(it.price || 0)), 0);
  const total = subtotal + Number(tax || 0) - Number(discount || 0);

  const getAuthHeader = (): Record<string,string> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const handleSave = async () => {
    // validation
    if (selectedClientId === 'new' && !clientData.email) {
      toast.error('Client email is required');
      return;
    }
    setSaving(true);
    try {
      let clientId = selectedClientId !== 'new' ? selectedClientId : undefined;
      if (!clientId) {
        // create client
        const res = await fetch('/api/clients', { method: 'POST', headers: { 'Content-Type': 'application/json', ...getAuthHeader() }, body: JSON.stringify(clientData) });
        if (!res.ok) throw new Error('Failed to create client');
        const created = await res.json();
        clientId = created._id || created.id;
      }

      const payload = { clientId, items, tax, discount, notes };
      const res = await fetch('/api/invoices', { method: 'POST', headers: { 'Content-Type': 'application/json', ...getAuthHeader() }, body: JSON.stringify(payload) });
      if (!res.ok) {
        const b = await res.text();
        throw new Error(b || 'Failed to create invoice');
      }
      const created = await res.json();
      toast.success('Invoice saved');
      // redirect to invoice page
      if (created._id) window.location.href = `/invoices/${created._id}`;
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold">New Invoice</h2>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Client</label>
            <select className="mt-1 w-full" value={selectedClientId} onChange={(e) => setSelectedClientId(e.target.value as any)}>
              <option value="new">Create New Client</option>
              {clients.map((c) => (
                <option key={c._id} value={c._id}>{`${c.name} ${c.businessName ? `(${c.businessName})` : ''} - ${c.email}`}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Client Email</label>
            <input className="mt-1 w-full" value={clientData.email} onChange={(e) => setClientData((s) => ({ ...s, email: e.target.value }))} />
          </div>
        </div>

        <div className="mt-4">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="border p-2">#</th>
                <th className="border p-2">Description</th>
                <th className="border p-2">Qty</th>
                <th className="border p-2">Price</th>
                <th className="border p-2">Total</th>
                <th className="border p-2"> </th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, idx) => (
                <ItemRow key={idx} item={it} index={idx} onChange={updateItem} onRemove={removeRow} />
              ))}
            </tbody>
          </table>

          <div className="flex gap-2 mt-2">
            <button className="px-3 py-1 border rounded" onClick={addRow}>Add Row</button>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm">Tax</label>
              <input type="number" className="mt-1 w-full" value={tax} onChange={(e) => setTax(Number(e.target.value))} />
            </div>
            <div>
              <label className="block text-sm">Discount</label>
              <input type="number" className="mt-1 w-full" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} />
            </div>
            <div>
              <label className="block text-sm">Subtotal</label>
              <div className="mt-1">₹{subtotal.toFixed(2)}</div>
            </div>
          </div>

          <div className="mt-4 text-right">
            <div className="text-lg font-bold">Total: ₹{total.toFixed(2)}</div>
          </div>

          <div className="mt-4">
            <label className="block text-sm">Notes</label>
            <textarea className="mt-1 w-full" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button className="px-4 py-2 border rounded" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save as Draft'}</button>
          </div>
        </div>
      </div>

      {/* Mobile sticky bar */}
      <div className="fixed bottom-4 left-0 right-0 max-w-3xl mx-auto px-4 sm:px-6 md:hidden">
        <div className="bg-white shadow-md rounded-lg p-3 flex gap-3 justify-end">
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded w-full">{saving ? 'Saving...' : 'Save as Draft'}</button>
        </div>
      </div>
    </div>
  );
}
