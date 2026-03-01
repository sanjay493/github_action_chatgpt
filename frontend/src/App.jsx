import { useEffect, useState } from "react";

function App() {
  const [poems, setPoems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPoem, setSelectedPoem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newPoem, setNewPoem] = useState({ title: "", poet: "", content: "", gist: "", year_written: "" });

  const API_URL = import.meta.env.VITE_API_URL || "/api";

  const fetchPoems = (search = "") => {
    setLoading(true);
    const url = search ? `${API_URL}/poems?search=${encodeURIComponent(search)}` : `${API_URL}/poems`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setPoems(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Poem fetch error:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPoems();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPoems(searchTerm);
  };

  const handleAddPoem = (e) => {
    e.preventDefault();
    fetch(`${API_URL}/poems`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPoem),
    })
      .then(res => res.json())
      .then(() => {
        setNewPoem({ title: "", poet: "", content: "", gist: "", year_written: "" });
        fetchPoems();
        alert("Poem added to the collection!");
      })
      .catch(err => alert("Error adding poem: " + err.message));
  };

  if (loading && poems.length === 0) return <div className="loading">Magic is happening... ✨</div>;

  return (
    <div className="container">
      <header>
        <h1>Poem Land 🌈</h1>
        <h3>Discover the most trending poems for children!</h3>
      </header>

      <section className="search-section">
        <form onSubmit={handleSearch} className="search-bar">
          <input
            type="text"
            placeholder="Search by title, poet, or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">Search 🔍</button>
        </form>
      </section>

      <main>
        <div className="poems-grid">
          {poems.map(poem => (
            <div key={poem.id} className="poem-card" onClick={() => setSelectedPoem(poem)}>
              <h4>{poem.title}</h4>
              <p className="poet">By {poem.poet}</p>
              <p className="gist">{poem.gist}</p>
              {poem.year_written && <p className="year">Written in: {poem.year_written}</p>}
            </div>
          ))}
        </div>
        {!loading && poems.length === 0 && <p className="no-results">No poems found. Try another search! 🧸</p>}
      </main>

      {selectedPoem && (
        <div className="poem-detail-modal" onClick={() => setSelectedPoem(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="close-btn" onClick={() => setSelectedPoem(null)}>X</div>
            <h2>{selectedPoem.title}</h2>
            <p className="poet">By {selectedPoem.poet}</p>
            <div className="content">{selectedPoem.content}</div>
            <p className="gist"><strong>The Gist:</strong> {selectedPoem.gist}</p>
            {selectedPoem.year_written && <p><strong>Year:</strong> {selectedPoem.year_written}</p>}
          </div>
        </div>
      )}

      <section className="form-section">
        <h2>Contribute a Poem ✍️</h2>
        <form onSubmit={handleAddPoem}>
          <input
            placeholder="Poem Title"
            value={newPoem.title}
            onChange={e => setNewPoem({ ...newPoem, title: e.target.value })}
            required
          />
          <input
            placeholder="Poet Name"
            value={newPoem.poet}
            onChange={e => setNewPoem({ ...newPoem, poet: e.target.value })}
            required
          />
          <textarea
            placeholder="Poem Content"
            rows="5"
            value={newPoem.content}
            onChange={e => setNewPoem({ ...newPoem, content: e.target.value })}
            required
          />
          <input
            placeholder="Quick Gist (Meaning)"
            value={newPoem.gist}
            onChange={e => setNewPoem({ ...newPoem, gist: e.target.value })}
            required
          />
          <input
            placeholder="Year Written (Optional)"
            value={newPoem.year_written}
            onChange={e => setNewPoem({ ...newPoem, year_written: e.target.value })}
          />
          <button type="submit">Add to Collection 🚀</button>
        </form>
      </section>
    </div>
  );
}

export default App;