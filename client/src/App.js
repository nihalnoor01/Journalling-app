// client/src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import EditorPage from './pages/EditorPage';
import './App.css';
import './App.css'; // base layout
//import './styles/dark-theme.css'; // dark mode




const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));

useEffect(() => {
  const handleStorageChange = () => {
    setToken(localStorage.getItem('token'));
  };

  window.addEventListener('storage', handleStorageChange);
  return () => window.removeEventListener('storage', handleStorageChange);
}, []);


  return (
    <Router>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/login" element={<LoginPage setToken={setToken} />} />

          <Route path="/register" element={<RegisterPage />} />
          <Route 
            path="/dashboard" 
            element={token ? <DashboardPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/edit/:id" 
            element={token ? <EditorPage /> : <Navigate to="/login" />} 
          />
           <Route 
            path="/new" 
            element={token ? <EditorPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/" 
            element={token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} 
          />
        </Routes>
      </main>
    </Router>
  );
};

export default App;