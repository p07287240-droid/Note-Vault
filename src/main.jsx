import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const initialNotes = [
  {
    _id: 'sample-1',
    title: 'Sprint retro notes',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'sample-2',
    title: 'API error codes to remember',
    createdAt: Date.now() - 7200000,
  },
  {
    _id: 'sample-3',
    title: 'Mongoose schema checklist',
    createdAt: Date.now() - 86400000,
  },
  {
    _id: 'sample-4',
    title: 'Axios baseURL setup',
    createdAt: Date.now() - 172800000,
  },
];

function App() {
  const [notes, setNotes] = useState(initialNotes);
  const [title, setTitle] = useState('');
  const [user, setUser] = useState(() => {
    try {
      return (
        JSON.parse(localStorage.getItem('notevault-user')) || {
          name: 'Padmashree', email: 'padmashree@mail.com',});
    } catch {
      return {
        name: 'Padmashree',
        email: 'padmashree@mail.com',
      };
    }
  });
  const [apiLabel, setApiLabel] = useState('Local notes  ready');
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    document.title = 'NoteVault  My Notes';

    if (!apiUrl) return;

    fetch(`${apiUrl.replace(/\/$/, '')}/notes?ownerId=${user.id || ''}`)
      .then((response) => {
        if (!response.ok) throw new Error('API unavailable');
        return response.json();
      })
      .then((items) => {
        setNotes(items);
        setApiLabel('GET /notes � connected');
      })
      .catch(() => setApiLabel('Local preview � API unavailable'));
  }, [apiUrl, user.id]);

  async function addNote(event) {
    event.preventDefault();

    const cleanTitle = title.trim();
    if (!cleanTitle) return;

    let note = {
      _id: crypto.randomUUID(),
      title: cleanTitle,
      createdAt: new Date().toISOString(),
    };

    if (apiUrl && user.id) {
      try {
        const response = await fetch(`${apiUrl.replace(/\/$/, '')}/notes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: cleanTitle,
            content: '',
            ownerId: user.id,
          }),
        });

        if (!response.ok) throw new Error('Could not save note');
        note = await response.json();
      } catch {
        setApiLabel('Local preview  save failed');
      }
    }

    setNotes((current) => [note, ...current]);
    setTitle('');
  }

  async function deleteNote(id) {
    if (apiUrl && user.id && !String(id).startsWith('sample-')) {
      try {
        await fetch(`${apiUrl.replace(/\/$/, '')}/notes/${id}`, {
          method: 'DELETE',
        });
      } catch {
        setApiLabel('Local preview  delete failed');
      }
    }

    setNotes((current) => current.filter((note) => note._id !== id));
  }

  function updateProfile(event) {
    const next = { ...user, [event.target.name]: event.target.value };
    setUser(next);
    localStorage.setItem('notevault-user', JSON.stringify(next));
  }

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="#notes" aria-label="NoteVault home">
          <span className="brand-icon" aria-hidden="true">
            {'\uD83D\uDCC1'}
          </span>
          <span>
            <strong>NoteVault</strong>
            <small>/notes  MERN capstone</small>
          </span>
        </a>

        <div className="tech-pills">
          <span>React</span>
          <span>Express</span>
          <span>MongoDB</span>
        </div>
      </header>

      <div className="dashboard" id="notes">
        <aside className="sidebar">
          <section>
            <h2 className="eyebrow">Signed in</h2>
            <div className="profile">
              <div className="avatar">
                {user.name
                  .split(/\s+/)
                  .map((part) => part[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div className="profile-inputs">
                <input aria-label="Your name" name="name" value={user.name} onChange={updateProfile}/>
                <input aria-label="Your email" name="email" type="email" value={user.email} onChange={updateProfile}/>
              </div>
            </div>
          </section>

          <section className="new-note">
            <h2 className="eyebrow">New note</h2>
            <form onSubmit={addNote}>
              <label htmlFor="note-title">Title</label>
              <input id="note-title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Give your note a title" maxLength="120" required/>
              <button type="submit">+ Add Note</button>
            </form>
          </section>
        </aside>

        <section className="notes-panel">
          <div className="notes-heading">
            <h1>My Notes</h1>
            <span className="notes-meta">
              {notes.length} {notes.length === 1 ? 'note' : 'notes'}  {apiLabel}
            </span>
          </div>

          {notes.length ? (
            <ul className="note-list">
              {notes.map((note) => (
                <li className="note-card" key={note._id}>
                  <div>
                    <h2>{note.title}</h2>
                    <p>added {formatAge(note.createdAt)}</p>
                  </div>
                  <button className="delete-button" onClick={() => deleteNote(note._id)} aria-label={`Delete ${note.title}`}>Delete</button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-state">
              <span aria-hidden="true">{'\u2726'}</span>
              <h2>Your notes start here</h2>
              <p>Add a note from the panel to keep an idea close.</p>
            </div>
          )}

          <div className="api-flow">
            <span>POST</span> /auth/login <b>{'\u2192'}</b> <span>GET</span> /notes{' '}
            <b>{'\u2192'}</b> <span>POST</span> /notes <b>{'\u2192'}</b>{' '}
            <span>DELETE</span> /notes/:id
          </div>
        </section>
      </div>
    </main>
  );
}

function formatAge(value) {
  const elapsed = Math.max(0, Date.now() - new Date(value || Date.now()).getTime());

  if (elapsed < 60000) return 'just now';
  if (elapsed < 3600000) return `${Math.floor(elapsed / 60000)}m ago`;
  if (elapsed < 86400000) return `${Math.floor(elapsed / 3600000)}h ago`;
  if (elapsed < 172800000) return 'yesterday';

  return `${Math.floor(elapsed / 86400000)} days ago`;
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
