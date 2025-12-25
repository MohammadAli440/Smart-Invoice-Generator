'use client';
import React from 'react';

export default function DashboardSummary({ invoices }: { invoices: any[] }) {
  const totalEarnings = invoices.reduce((acc, inv) => acc + Number(inv.total || 0), 0);
  const counts = invoices.reduce((acc: any, inv: any) => {
    acc[inv.status] = (acc[inv.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded shadow">
        <div className="text-sm text-gray-500">Total Earnings</div>
        <div className="text-2xl font-bold">₹{totalEarnings.toFixed(2)}</div>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <div className="text-sm text-gray-500">Invoices: Draft</div>
        <div className="text-2xl font-bold">{counts['Draft'] || 0}</div>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <div className="text-sm text-gray-500">Invoices: Sent</div>
        <div className="text-2xl font-bold">{counts['Sent'] || 0}</div>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <div className="text-sm text-gray-500">Invoices: Paid</div>
        <div className="text-2xl font-bold">{counts['Paid'] || 0}</div>
      </div>
    </div>
  );
}
