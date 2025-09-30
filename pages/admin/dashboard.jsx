import { useEffect, useState } from 'react';

export default function AdminDashboard(){
  const [sessions,setSessions]=useState([]);
  useEffect(()=>{ fetch('/api/reports').then(r=>r.json()).then(d=>setSessions(d.sessions||[])); },[]);
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sessions.map(s=>(<div key={s._id} className="card p-4 rounded"><div className="font-semibold">{s.candidateEmail}</div><div className="text-sm text-gray-400">{s._id}</div><a className="text-indigo-400" href={`/admin/session/${s._id}`}>View</a></div>))}
        </div>
      </div>
    </div>
  )
}
