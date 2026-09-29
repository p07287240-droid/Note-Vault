import { useState,useEffect } from "react";
import api from "../api/axios";

function Notes({user}){
    const [note,setNotes] = useState(['']);
    const [title,setTitle] = useState ('');
    useEffect(()=>{
        document.title = 'My Notes';
         api.get('/notes', {params: {ownerId: user.id}}).then(res => setNotes(res.data));
    }, [user.id]);

  const addNote = async (e) => {
    e.preventDefault();
    const res = await api.post('/notes', {title,content: '',ownerId: user.id});
    setNotes([...notes, res.data]);
    setTitle('');
  };

  const removeNote = async (id) => {
    await api.delete(`/notes/${id}`);

    setNotes(notes.filter(n => n._id !== id));
  };

  return (
    <div>
      <form onSubmit={addNote}>
        <input value={title} onChange={(e) => setTitle(e.target.value)}placeholder="New note title"/>
        <button type="submit">Add</button>
      </form>
      <ul>
        {notes.map(n => (<li key={n._id}>{n.title} <button onClick={() => removeNote(n._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Notes; 