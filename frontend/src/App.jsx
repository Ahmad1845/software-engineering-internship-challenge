import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Ticket as TicketIcon, Plus, Settings, LogOut, Search, Bell, HelpCircle, Headset } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import AllTickets from './pages/AllTickets';
import CreateTicket from './pages/CreateTicket';
import TicketDetail from './pages/TicketDetail';

function Sidebar() {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo-icon">
          <Headset size={20} color="white" />
        </div>
        <div>
          <div className="sidebar-logo-text">SupportDesk</div>
          <div className="sidebar-logo-subtext">Internal Support</div>
        </div>
      </div>

      <div className="sidebar-nav">
        <Link to="/" className={`nav-item ${isActive('/') && location.pathname === '/' ? 'active' : ''}`}>
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </Link>
        <Link to="/tickets" className={`nav-item ${isActive('/tickets') || location.pathname.startsWith('/ticket/') ? 'active' : ''}`}>
          <TicketIcon size={18} />
          <span>All Tickets</span>
        </Link>
        <div className="nav-btn-wrapper">
          <Link to="/create" style={{ textDecoration: 'none' }}>
            <button className="btn-sidebar-new">
              <Plus size={16} /> New Ticket
            </button>
          </Link>
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="nav-item">
          <Settings size={18} />
          <span>Settings</span>
        </div>
        <div className="nav-item">
          <LogOut size={18} />
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
}

function Topbar() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      if (searchTerm.trim()) {
        navigate(`/tickets?search=${encodeURIComponent(searchTerm)}`);
      } else {
        navigate(`/tickets`);
      }
    }
  };

  return (
    <div className="topbar">
      <div className="search-wrapper">
        <Search className="search-icon" size={16} />
        <input 
          type="text" 
          className="search-input" 
          placeholder="Search tickets..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleSearch}
        />
      </div>
      <div className="topbar-actions">
        <img src="https://ui-avatars.com/api/?name=Admin&background=e5e7eb" alt="Profile" className="avatar" />
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-wrapper">
          <Topbar />
          <div className="page-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/tickets" element={<AllTickets />} />
              <Route path="/create" element={<CreateTicket />} />
              <Route path="/ticket/:id" element={<TicketDetail />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
