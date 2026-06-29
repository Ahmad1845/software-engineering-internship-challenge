import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Moon, Sun, Ticket } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import CreateTicket from './pages/CreateTicket';
import TicketDetail from './pages/TicketDetail';

function App() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <Router>
      <div className="app">
        <header className="header">
          <Link to="/" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem', color: 'var(--text-primary)' }}>
            <Ticket size={24} color="var(--accent-color)" />
            <span style={{ fontWeight: 'bold' }}>SupportDesk</span>
          </Link>
          <nav className="nav-links">
            <Link to="/" className="nav-link">Dashboard</Link>
            <Link to="/create" className="btn">Create Ticket</Link>
            <button onClick={toggleTheme} className="btn-outline" style={{ padding: '0.5rem', borderRadius: '50%' }} title="Toggle Dark Mode">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </nav>
        </header>

        <main className="container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create" element={<CreateTicket />} />
            <Route path="/ticket/:id" element={<TicketDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
