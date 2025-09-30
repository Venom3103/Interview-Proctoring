export default function EventTimeline({ events }){
  return (
    <div className="max-h-96 overflow-auto">
      {events.map((e,i)=>(<div key={i} className="mb-2 border-b pb-1"><div className="font-medium">{e.type}</div><div className="text-xs text-gray-400">{new Date(e.timestamp).toLocaleString()}</div></div>))}
    </div>
  );
}
