'use client';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function AccountSettings() {
  const [user, setUser] = useState<any>({ email: '' });
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    async function load(){
      try{
        const token = localStorage.getItem('accessToken');
        const res = await fetch('/api/user', { headers: token ? { Authorization: `Bearer ${token}` } : {} });
        if (!res.ok) throw new Error('Failed');
        setUser(await res.json());
      }catch(err){console.error(err);}finally{setLoading(false);}    }
    load();
  },[]);

  const save = async ()=>{
    try{
      const token = localStorage.getItem('accessToken');
      const res = await fetch('/api/user', { method: 'PUT', headers: { 'Content-Type':'application/json', ...(token?{ Authorization:`Bearer ${token}` }: {}) }, body: JSON.stringify({ email: user.email }) });
      if(!res.ok) throw new Error('Failed');
      toast.success('Saved');
    }catch(err){console.error(err); toast.error('Save failed');}
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Account</h1>
      {loading ? <div>Loading...</div> : (
        <div className="bg-white rounded shadow p-4">
          <label className="block text-sm">Email</label>
          <input className="w-full border p-2 mb-2" value={user.email || ''} onChange={(e:any)=>setUser((s:any)=>({ ...s, email: e.target.value }))} />
          <div className="flex justify-end"><button onClick={save} className="px-4 py-2 bg-green-600 text-white rounded">Save</button></div>
        </div>
      )}
    </div>
  );
}
