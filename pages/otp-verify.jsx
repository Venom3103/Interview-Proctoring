import { useState } from 'react';
import { useRouter } from 'next/router';

export default function OTPVerify(){
  const [otp,setOtp]=useState(''); const [msg,setMsg]=useState('');
  const router = useRouter();
  const email = typeof window !== 'undefined' ? sessionStorage.getItem('auth_email') : '';
  const role = typeof window !== 'undefined' ? sessionStorage.getItem('auth_role') : 'user';

  const verify = async ()=>{
    if(!otp){ setMsg('Enter OTP'); return; }
    const res = await fetch('/api/verify-otp', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email, otp, role }) });
    const data = await res.json();
    if(data.ok){
      if(role==='admin'){ localStorage.setItem('admin_token', data.token); router.push('/admin/dashboard'); }
      else { sessionStorage.setItem('sessionId', data.sessionId); router.push(`/session/${data.sessionId}`); }
    } else setMsg(data.message || 'Invalid OTP');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md p-8 card rounded-2xl text-white">
        <h2 className="text-xl font-bold">Verify OTP</h2>
        <p className="small">OTP sent to {email}</p>
        <input className="w-full p-3 mt-4 rounded text-black" value={otp} onChange={e=>setOtp(e.target.value)} placeholder="Enter OTP" />
        <button onClick={verify} className="w-full py-2 mt-4 rounded bg-accent">Verify</button>
        {msg && <div className="mt-3 small">{msg}</div>}
      </div>
    </div>
  )
}
