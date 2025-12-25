'use client';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

export default function InvoiceActions({ invoiceId, clientEmail, invoiceNumber }: { invoiceId: string; clientEmail?: string; invoiceNumber?: string }) {
  const [sending, setSending] = useState(false);

  const getAuthHeader = (): Record<string,string> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const handleDownload = async () => {
    try {
      const res = await fetch(`/api/pdf/invoice/${invoiceId}`, { headers: { ...getAuthHeader() } });
      if (!res.ok) throw new Error('Failed to download PDF');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const fileName = `Invoice-${invoiceNumber || invoiceId}-${(clientEmail || 'client').replace(/[^a-z0-9@.-]/gi, '')}.pdf`;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success('Download started');
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || 'Download failed');
    }
  };

  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduledAt, setScheduledAt] = useState('');
  const [schedTo, setSchedTo] = useState(clientEmail || '');
  const [schedSubject, setSchedSubject] = useState('');
  const [schedMessage, setSchedMessage] = useState('');
  const [scheduling, setScheduling] = useState(false);

  const handleSend = async () => {
    setSending(true);
    try {
      const res = await fetch(`/api/invoices/${invoiceId}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({ to: clientEmail })
      });
      if (!res.ok) {
        const body = await res.text();
        throw new Error(body || 'Send failed');
      }
      toast.success('Email sent');
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || 'Send failed');
    } finally {
      setSending(false);
    }
  };

  const handleScheduleSubmit = async () => {
    if (!scheduledAt) return toast.error('Select a date and time');
    setScheduling(true);
    try {
      const res = await fetch(`/api/scheduled/invoice/${invoiceId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({ scheduledAt, to: schedTo, subject: schedSubject, message: schedMessage })
      });
      if (!res.ok) throw new Error('Failed to schedule');
      toast.success('Scheduled successfully');
      setShowSchedule(false);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || 'Scheduling failed');
    } finally {
      setScheduling(false);
    }
  };


  return (
    <div className="fixed bottom-4 left-0 right-0 max-w-3xl mx-auto px-4 sm:px-6">
      <div className="bg-white shadow-md rounded-lg p-3 flex gap-3 justify-end">
        <button onClick={handleDownload} className="px-4 py-2 bg-gray-200 rounded">Download PDF</button>
        <button onClick={() => setShowSchedule(true)} className="px-4 py-2 bg-yellow-500 text-white rounded">Schedule</button>
        <button onClick={handleSend} disabled={sending} className="px-4 py-2 bg-blue-600 text-white rounded">{sending ? 'Sending...' : 'Send PDF'}</button>
      </div>

      {showSchedule && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded p-4 w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-2">Schedule Send</h3>
            <div className="space-y-2">
              <label className="block text-sm">To</label>
              <input value={schedTo} onChange={(e: any) => setSchedTo(e.target.value)} className="w-full border p-2 rounded" />
              <label className="block text-sm">When</label>
              <input value={scheduledAt} onChange={(e: any) => setScheduledAt(e.target.value)} type="datetime-local" className="w-full border p-2 rounded" />
              <label className="block text-sm">Subject</label>
              <input value={schedSubject} onChange={(e: any) => setSchedSubject(e.target.value)} className="w-full border p-2 rounded" />
              <label className="block text-sm">Message</label>
              <textarea value={schedMessage} onChange={(e: any) => setSchedMessage(e.target.value)} className="w-full border p-2 rounded" rows={4} />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setShowSchedule(false)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
              <button onClick={handleScheduleSubmit} disabled={scheduling} className="px-4 py-2 bg-green-600 text-white rounded">{scheduling ? 'Scheduling...' : 'Schedule'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
