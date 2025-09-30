import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Home(){ 
  const [email,setEmail]=useState('');
  const [role,setRole]=useState('user');
  const [msg,setMsg]=useState('');
  const router = useRouter();

  const sendOtp = async ()=>{
    if(!email){ setMsg('Enter email'); return; }
    setMsg('Sending OTP...');
    const res = await fetch('/api/send-otp', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email, role }) });
    const data = await res.json();
    if(data.ok){ sessionStorage.setItem('auth_email', email); sessionStorage.setItem('auth_role', role); router.push('/otp-verify'); }
    else setMsg(data.message || 'Failed');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md p-8 rounded-2xl card">
        <h1 className="text-2xl font-bold mb-4 text-white">Sign in to Interview Proctoring</h1>
        <label className="text-sm small text-white">Who you are ?</label>
        <div className="flex gap-2 my-3">
          <button onClick={()=>setRole('user')} className={role==='user'?'px-4 py-2 bg-indigo-600 rounded':'px-4 py-2 bg-gray-700 rounded'}>Candidate</button>
          <button onClick={()=>setRole('admin')} className={role==='admin'?'px-4 py-2 bg-indigo-600 rounded':'px-4 py-2 bg-gray-700 rounded'}>Admin</button>
        </div>
        <input className="w-full p-3 rounded mb-3 text-black" placeholder="Type your email" value={email} onChange={e=>setEmail(e.target.value)} />
        <button onClick={sendOtp} className="w-full py-2 rounded bg-accent text-white">Send OTP</button>
        {msg && <div className="mt-3 small">{msg}</div>}
      </div>
    </div>
  )
}
