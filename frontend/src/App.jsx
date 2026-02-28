import { useEffect, useState } from "react";

function App() {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);

  // load profile
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/profile`)
      .then(res => res.json())
      .then(data => setProfile(data))
      .catch(err => console.error("Profile error:", err));
  }, []);

  // load projects
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/projects`)
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(err => console.error("Projects error:", err));
  }, []);

  if (!profile) return <h2>Loading portfolio...</h2>;

  return (
    <div style={{ fontFamily: "Arial", padding: "40px" }}>
      <h1>{profile.name}</h1>
      <h3>{profile.role}</h3>

      <p>{profile.bio}</p>

      <h3>Contact</h3>
      <p>Email: {profile.email}</p>
      <p>
        <a href={profile.github} target="_blank">GitHub</a> |{" "}
        <a href={profile.linkedin} target="_blank">LinkedIn</a>
      </p>

      <h2>Projects</h2>
      {projects.length === 0 ? (
        <p>No projects yet</p>
      ) : (
        projects.map(p => (
          <div key={p.id} style={{ marginBottom: "10px" }}>
            <b>{p.title}</b> — {p.tech}
          </div>
        ))
      )}
    </div>
  );
}

export default App;