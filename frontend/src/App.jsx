import { useEffect, useState } from "react";

function App() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/profile`)
      .then(res => res.json())
      .then(data => setProfile(data))
      .catch(err => console.error(err));
  }, []);

  if (!profile) return <h2>Loading portfolio...</h2>;

  return (
    <div style={{ fontFamily: "Arial", padding: "40px" }}>
      <h1>{profile.name}</h1>
      <h3>{profile.role}</h3>

      <h2>Skills</h2>
      <ul>
        {profile.skills.map((s, i) => <li key={i}>{s}</li>)}
      </ul>

      <h2>Experience</h2>
      <p>{profile.experience}</p>

      <h2>Projects</h2>
      {profile.projects.map((p, i) => (
        <div key={i}>
          <strong>{p.title}</strong> — {p.tech}
        </div>
      ))}
    </div>
  );
}

export default App;