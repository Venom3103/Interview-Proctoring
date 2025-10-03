import React, { useEffect, useState } from "react";

export default function ManageRoles() {
  const [roles, setRoles] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [newRole, setNewRole] = useState("");
  const [newExp, setNewExp] = useState("");

  useEffect(() => {
    const savedRoles = JSON.parse(localStorage.getItem("roles") || "[]");
    const savedExp = JSON.parse(localStorage.getItem("experiences") || "[]");
    setRoles(savedRoles);
    setExperiences(savedExp);
  }, []);

  const addRole = () => {
    if (!newRole) return;
    const updated = [...roles, newRole];
    setRoles(updated);
    localStorage.setItem("roles", JSON.stringify(updated));
    setNewRole("");
  };

  const addExperience = () => {
    if (!newExp) return;
    const updated = [...experiences, newExp];
    setExperiences(updated);
    localStorage.setItem("experiences", JSON.stringify(updated));
    setNewExp("");
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Roles & Experience</h2>
      <div className="flex gap-8">
        <div>
          <h3 className="font-semibold">Roles</h3>
          <ul>{roles.map((r, i) => <li key={i}>{r}</li>)}</ul>
          <input
            type="text"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            placeholder="Add Role"
            className="border p-1"
          />
          <button onClick={addRole} className="ml-2 btn">Add</button>
        </div>
        <div>
          <h3 className="font-semibold">Experience</h3>
          <ul>{experiences.map((e, i) => <li key={i}>{e}</li>)}</ul>
          <input
            type="text"
            value={newExp}
            onChange={(e) => setNewExp(e.target.value)}
            placeholder="Add Experience"
            className="border p-1"
          />
          <button onClick={addExperience} className="ml-2 btn">Add</button>
        </div>
      </div>
    </div>
  );
}
