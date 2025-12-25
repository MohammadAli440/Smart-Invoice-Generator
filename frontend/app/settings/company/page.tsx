'use client';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function CompanySettings() {
  const [company, setCompany] = useState<any>({ name: '', email: '', phone: '', website: '', address: '', logo: null });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await fetch('/api/company', { headers: token ? { Authorization: `Bearer ${token}` } : {} });
        if (!res.ok) return;
        const data = await res.json();
        setCompany(data || { name: '', email: '', phone: '', website: '', address: '', logo: null });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const getAuthHeader = (): Record<string,string> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/company', { method: 'POST', headers: { 'Content-Type': 'application/json', ...getAuthHeader() }, body: JSON.stringify(company) });
      if (!res.ok) throw new Error('Save failed');
      const data = await res.json();
      setCompany(data);
      toast.success('Company saved');
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return toast.error('Select a file');
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/company/logo', { method: 'POST', body: fd, headers: getAuthHeader() as any });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      setCompany((s: any) => ({ ...s, logo: data.logo }));
      toast.success('Logo uploaded');
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || 'Upload failed');
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Company Profile</h1>
      <div className="bg-white p-6 rounded shadow">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Business Name</label>
            <input className="mt-1 w-full" value={company.name || ''} onChange={(e) => setCompany((s: any) => ({ ...s, name: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input className="mt-1 w-full" value={company.email || ''} onChange={(e) => setCompany((s: any) => ({ ...s, email: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium">Phone</label>
            <input className="mt-1 w-full" value={company.phone || ''} onChange={(e) => setCompany((s: any) => ({ ...s, phone: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium">Website</label>
            <input className="mt-1 w-full" value={company.website || ''} onChange={(e) => setCompany((s: any) => ({ ...s, website: e.target.value }))} />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium">Address</label>
            <input className="mt-1 w-full" value={company.address || ''} onChange={(e) => setCompany((s: any) => ({ ...s, address: e.target.value }))} />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium">Logo</label>
          <div className="mt-2 flex items-center gap-4">
            {company.logo?.url ? <img src={company.logo.url} alt="logo" className="h-16 object-contain" /> : <div className="h-16 w-32 bg-gray-100 rounded flex items-center justify-center text-sm text-gray-500">No logo</div>}
            <div>
              <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)} />
              <div className="mt-2 flex gap-2">
                <button onClick={handleUpload} className="px-3 py-1 bg-gray-200 rounded">Upload</button>
                <button onClick={handleSave} className="px-3 py-1 bg-blue-600 text-white rounded" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
