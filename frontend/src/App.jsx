import { useEffect, useState } from "react";

function App() {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ title: "", tech: "" });
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "/api";

  // load profile
  useEffect(() => {
    fetch(`${API_URL}/profile`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to load profile");
        return res.json();
      })
      .then(data => setProfile(data))
      .catch(err => {
        console.error("Profile error:", err);
        setError(err.message);
      });
  }, []);

  // load projects
  const fetchProjects = () => {
    fetch(`${API_URL}/projects`)
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(err => console.error("Projects error:", err));
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleAddProject = (e) => {
    e.preventDefault();
    fetch(`${API_URL}/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProject),
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to add project");
        return res.json();
      })
      .then(() => {
        setNewProject({ title: "", tech: "" });
        fetchProjects();
      })
      .catch(err => alert(err.message));
  };

  if (error) return <div className="loading">Error: {error}</div>;
  if (!profile) return <div className="loading">Loading portfolio...</div>;

  return (
    <div className="container">
      <header>
        <h1>{profile.name}</h1>
        <h3>{profile.role}</h3>
      </header>

      <p className="bio">{profile.bio}</p>

      <div className="contact-links">
        <a href={`mailto:${profile.email}`}>Email</a>
        <a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
      </div>

      <section>
        <h2>Projects</h2>
        <div className="projects-grid">
          {projects.length === 0 ? (
            <p className="text-muted">No projects yet. Add one below!</p>
          ) : (
            projects.map(p => (
              <div key={p.id} className="project-card">
                <h4>{p.title}</h4>
                <p>{p.tech}</p>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="form-section">
        <h2>Add New Project</h2>
        <form onSubmit={handleAddProject}>
          <div className="form-group">
            <label>Project Title</label>
            <input
              type="text"
              placeholder="e.g. Portfolio Website"
              value={newProject.title}
              required
              onChange={e => setNewProject({ ...newProject, title: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Technologies</label>
            <input
              type="text"
              placeholder="e.g. React, FastAPI, Docker"
              value={newProject.tech}
              required
              onChange={e => setNewProject({ ...newProject, tech: e.target.value })}
            />
          </div>
          <button type="submit">Add Project</button>
        </form>
      </section>
    </div>
  );
}

export default App;