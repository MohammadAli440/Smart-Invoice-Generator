'use client';
import React, { useEffect, useState } from 'react';
import InvoiceForm from '../../../components/InvoiceForm';

export default function NewInvoicePage() {
  const [company, setCompany] = useState<any>(null);

  useEffect(() => {
    async function loadCompany() {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await fetch('/api/company', { headers: token ? { Authorization: `Bearer ${token}` } : {} });
        if (!res.ok) return;
        const data = await res.json();
        setCompany(data);
      } catch (err) {
        console.error(err);
      }
    }
    loadCompany();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {company && (
          <div className="mb-4">
            <h1 className="text-2xl font-bold">{company.name}</h1>
            <div className="text-sm text-gray-600">{company.email} • {company.phone}</div>
          </div>
        )}

        <InvoiceForm />
      </div>
    </div>
  );
}
