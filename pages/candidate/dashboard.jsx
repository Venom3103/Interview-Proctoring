import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function CandidateDashboard() {
  const [sessions, setSessions] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const savedSessions = JSON.parse(localStorage.getItem("sessions") || "[]");
    setSessions(savedSessions);
  }, []);

  const startInterview = (sessionId) => {
    router.push(`/session/interview?session_id=${sessionId}`);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Candidate Dashboard</h2>
      <div className="space-y-2">
        {sessions.map((s, i) => (
          <div key={i} className="border p-2 flex justify-between items-center">
            <div>
              <p>Role: {s.role}</p>
              <p>Experience: {s.experience}</p>
              <p>Scheduled: {new Date(s.startTime).toLocaleString()}</p>
            </div>
            <button className="btn" onClick={() => startInterview(s.id)}>Start</button>
          </div>
        ))}
      </div>
    </div>
  );
}
