'use client';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function ScheduledPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch('/api/scheduled', { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      if (!res.ok) throw new Error('Failed to load scheduled sends');
      const data = await res.json();
      setJobs(data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load');
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  const cancelJob = async (id: string) => {
    if (!confirm('Cancel this scheduled send?')) return;
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`/api/scheduled/${id}`, { method: 'DELETE', headers: token ? { Authorization: `Bearer ${token}` } : {} });
      if (!res.ok) throw new Error('Failed to cancel');
      toast.success('Canceled');
      load();
    } catch (err) { console.error(err); toast.error('Cancel failed'); }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Scheduled Sends</h1>
      {loading ? <div>Loading...</div> : (
        <div className="bg-white rounded shadow p-4">
          <table className="w-full table-auto">
            <thead><tr><th className="p-2">Invoice</th><th className="p-2">To</th><th className="p-2">When</th><th className="p-2">Status</th><th className="p-2">Actions</th></tr></thead>
            <tbody>
              {jobs.map(j => (
                <tr key={j._id}>
                  <td className="p-2">{j.invoiceId}</td>
                  <td className="p-2">{j.to}</td>
                  <td className="p-2">{new Date(j.scheduledAt).toLocaleString()}</td>
                  <td className="p-2">{j.status}</td>
                  <td className="p-2"><button onClick={()=>cancelJob(j._id)} className="px-2 py-1 bg-red-500 text-white rounded">Cancel</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
