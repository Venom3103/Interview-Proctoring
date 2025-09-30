import { useEffect, useRef } from 'react';
export default function WebcamCapture({ onReady }){
  const v = useRef();
  useEffect(()=>{
    (async ()=>{
      try{
        const s = await navigator.mediaDevices.getUserMedia({ video:true, audio:true });
        v.current.srcObject = s; await v.current.play();
        if(onReady) onReady(s);
      }catch(e){ console.error('camera error', e); alert('Camera access required'); }
    })();
  },[]);
  return <video ref={v} className="rounded" width="100%" height="480" playsInline muted />;
}
