import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function CreateQuestions() {
  const [roles, setRoles] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedExp, setSelectedExp] = useState("");
  const [skills, setSkills] = useState("");
  const [questions, setQuestions] = useState([]);
  const router = useRouter();

  useEffect(() => {
    setRoles(JSON.parse(localStorage.getItem("roles") || "[]"));
    setExperiences(JSON.parse(localStorage.getItem("experiences") || "[]"));
  }, []);

  const generateQuestions = async () => {
    if (!selectedRole || !selectedExp || !skills) return;
    const res = await fetch("/api/ai-questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: selectedRole, experience: selectedExp, skills: skills.split(","), num: 6 }),
    });
    const data = await res.json();
    setQuestions(data.questions);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Create Questions</h2>
      <div className="flex gap-4 items-center mb-4">
        <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} className="border p-1">
          <option value="">Select Role</option>
          {roles.map((r, i) => <option key={i} value={r}>{r}</option>)}
        </select>
        <select value={selectedExp} onChange={(e) => setSelectedExp(e.target.value)} className="border p-1">
          <option value="">Select Experience</option>
          {experiences.map((e, i) => <option key={i} value={e}>{e}</option>)}
        </select>
        <input
          type="text"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          placeholder="Skills (comma separated)"
          className="border p-1"
        />
        <button onClick={generateQuestions} className="btn">Generate</button>
      </div>
      <div>
        <h3 className="font-semibold mb-2">Generated Questions:</h3>
        <ol className="list-decimal ml-4">
          {questions.map((q, i) => <li key={i}>{q.text} ({q.type})</li>)}
        </ol>
      </div>
    </div>
  );
}
