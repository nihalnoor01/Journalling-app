// client/src/pages/EditorPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // import styles

const EditorPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    mood: 'Calm',
    tags: '',
  });
  const { title, content, mood, tags } = formData;
  const navigate = useNavigate();
  const { id } = useParams(); // For editing existing entries

  useEffect(() => {
    if (id) {
      // If there's an ID, it's an edit, so fetch the entry data
      const fetchEntry = async () => {
        try {
          const token = localStorage.getItem('token');
          // For simplicity, we will fetch all and filter client side, though not ideal.
          const allEntries = await axios.get('http://localhost:5000/api/journal', {
            headers: { 'x-auth-token': token }
          });
          const entryToEdit = allEntries.data.find(e => e._id === id);
          if(entryToEdit){
            setFormData({
              title: entryToEdit.title,
              content: entryToEdit.content,
              mood: entryToEdit.mood,
              tags: entryToEdit.tags.join(', '),
            });
          }
        } catch (err) {
          console.error(err);
        }
      };
      fetchEntry();
    }
  }, [id]);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onContentChange = (value) => {
    setFormData({ ...formData, content: value });
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token,
      },
    };
    const body = JSON.stringify({ title, content, mood, tags });
    
    try {
        if(id){
            // Update existing entry
            await axios.put(`http://localhost:5000/api/journal/${id}`, body, config);
        } else {
            // Create new entry
            await axios.post('http://localhost:5000/api/journal', body, config);
        }
      navigate('/dashboard');
    } catch (err) {
      console.error(err.response.data);
    }
  };
  
  return (
    <div className="editor-container">
      <h1>{id ? 'Edit Entry' : 'Create New Entry'}</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            value={title}
            onChange={onChange}
            required
          />
        </div>
         <div className="form-group">
          <label htmlFor="content">Body</label>
          <ReactQuill theme="snow" value={content} onChange={onContentChange} />
        </div>
        <div className="form-group">
          <label htmlFor="mood">Mood</label>
          <select name="mood" value={mood} onChange={onChange}>
            <option value="Happy">Happy</option>
            <option value="Sad">Sad</option>
            <option value="Anxious">Anxious</option>
            <option value="Excited">Excited</option>
            <option value="Calm">Calm</option>
            <option value="Productive">Productive</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="tags">Tags (comma separated)</label>
          <input
            type="text"
            name="tags"
            value={tags}
            onChange={onChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Save Entry
        </button>
      </form>
    </div>
  );
};

export default EditorPage;