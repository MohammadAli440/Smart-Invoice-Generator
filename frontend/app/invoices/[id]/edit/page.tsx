'use client';
import React from 'react';
import InvoiceForm from '../../../../components/InvoiceForm';

export default function EditInvoicePage({ params }: { params: { id: string } }) {
  // For now, reuse InvoiceForm and expect InvoiceForm to handle both new/edit via props in future
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Invoice</h1>
      <InvoiceForm />
    </div>
  );
}
