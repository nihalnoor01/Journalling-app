// client/src/pages/DashboardPage.js
import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const DashboardPage = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Memoize fetchEntries to safely add it to useEffect dependencies
  const fetchEntries = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const res = await axios.get('http://localhost:5000/api/journal', {
        headers: { 'x-auth-token': token },
      });
      setEntries(res.data);
    } catch (err) {
      console.error('Error fetching journal entries:', err);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/journal/${id}`, {
          headers: { 'x-auth-token': token },
        });
        fetchEntries(); // Refresh entries list after deletion
      } catch (err) {
        console.error('Failed to delete entry:', err);
      }
    }
  };

  if (loading) {
    return <p>Loading entries...</p>;
  }

  return (
  <div className="dashboard-container">
    <div className="header">
      <h1>Your Journal</h1>
      <Link to="/new" className="btn btn-primary">+ New Entry</Link>
    </div>

    <div className="entries-list">
      {entries.length > 0 ? (
        entries.map((entry) => (
          <div key={entry._id} className="entry-card">
            <h2>{entry.title}</h2>
            <p className="entry-meta">
              {new Date(entry.createdAt).toLocaleDateString()} - Mood: {entry.mood}
            </p>
            <div className="entry-tags">
              {entry.tags.map((tag) => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
            <div className="entry-actions">
              <Link to={`/edit/${entry._id}`} className="btn btn-secondary">Edit</Link>
              <button onClick={() => handleDelete(entry._id)} className="btn btn-danger">Delete</button>
            </div>
          </div>
        ))
      ) : (
        <p>No entries yet. Create your first one!</p>
      )}
    </div>
  </div>
);
};

export default DashboardPage;
