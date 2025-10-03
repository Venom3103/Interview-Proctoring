import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Report() {
  const [report, setReport] = useState(null);
  const router = useRouter();
  const { session_id } = router.query;

  useEffect(() => {
    if (!session_id) return;
    fetch(`/api/reports?sessionId=${session_id}`)
      .then(res => res.json())
      .then(data => setReport(data))
      .catch(err => console.error(err));
  }, [session_id]);

  if (!report) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Interview Report</h2>
      <div className="space-y-2">
        <p>Knowledge Score: {report.knowledgeScore}</p>
        <p>Communication Score: {report.communicationScore}</p>
        <p>Coding Score: {report.codingScore}</p>
        <p>Integrity Score: {report.integrityScore}</p>
        <p>Final Score: {report.finalScore}</p>
        <div>
          <h3 className="font-semibold">Detailed Feedback:</h3>
          <pre className="bg-gray-100 p-2 rounded">{JSON.stringify(report, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}
