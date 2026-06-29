import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Search, Filter, Clock, AlertCircle } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

export default function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({ total: 0, open: 0, inProgress: 0, resolved: 0, urgent: 0 });
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');

  useEffect(() => {
    fetchDashboardData();
  }, [search, statusFilter, priorityFilter, sortOrder]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch stats
      const statsRes = await axios.get(`${API_URL}/dashboard`);
      setStats(statsRes.data);

      // Fetch tickets
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);
      if (priorityFilter) params.append('priority', priorityFilter);
      if (sortOrder) params.append('sort', sortOrder);

      const ticketsRes = await axios.get(`${API_URL}/tickets?${params.toString()}`);
      setTickets(ticketsRes.data.tickets);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const classMap = {
      'Open': 'status-open',
      'In Progress': 'status-in-progress',
      'Resolved': 'status-resolved'
    };
    return <span className={`badge ${classMap[status]}`}>{status}</span>;
  };

  const getPriorityBadge = (priority) => {
    const classMap = {
      'Low': 'badge-low',
      'Medium': 'badge-medium',
      'High': 'badge-high'
    };
    return <span className={`badge ${classMap[priority]}`}>{priority}</span>;
  };

  return (
    <div className="animate-fade-in">
      <div className="grid-stats">
        <div className="card stat-card" style={{ borderLeft: '4px solid var(--accent-color)' }}>
          <h3>Total Tickets</h3>
          <p style={{ color: 'var(--accent-color)' }}>{stats.total}</p>
        </div>
        <div className="card stat-card" style={{ borderLeft: '4px solid var(--status-open)' }}>
          <h3>Open</h3>
          <p style={{ color: 'var(--status-open)' }}>{stats.open}</p>
        </div>
        <div className="card stat-card" style={{ borderLeft: '4px solid var(--status-in-progress)' }}>
          <h3>In Progress</h3>
          <p style={{ color: 'var(--status-in-progress)' }}>{stats.inProgress}</p>
        </div>
        <div className="card stat-card" style={{ borderLeft: '4px solid var(--status-resolved)' }}>
          <h3>Resolved</h3>
          <p style={{ color: 'var(--status-resolved)' }}>{stats.resolved}</p>
        </div>
        <div className="card stat-card" style={{ borderLeft: '4px solid var(--priority-high)', backgroundColor: stats.urgent > 0 ? 'rgba(239, 68, 68, 0.05)' : '' }}>
          <h3>Urgent</h3>
          <p style={{ color: 'var(--priority-high)' }}>{stats.urgent}</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 300px', position: 'relative' }}>
            <Search style={{ position: 'absolute', top: '10px', left: '10px', color: 'var(--text-secondary)' }} size={20} />
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search by name, email or subject..." 
              style={{ paddingLeft: '2.5rem' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className="form-select" style={{ width: 'auto' }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
          <select className="form-select" style={{ width: 'auto' }} value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <select className="form-select" style={{ width: 'auto' }} value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Loading...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {tickets.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
              No tickets found matching your criteria.
            </div>
          ) : (
            tickets.map(ticket => (
              <Link to={`/ticket/${ticket.id}`} key={ticket.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderLeft: ticket.is_urgent ? '4px solid var(--priority-high)' : 'none' }}>
                  <div>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>#{ticket.id}</span>
                      <h4 style={{ margin: 0, fontSize: '1.125rem' }}>{ticket.subject}</h4>
                      {ticket.is_urgent ? <span className="badge badge-urgent"><AlertCircle size={12} style={{ display: 'inline', marginRight: '4px' }}/> URGENT</span> : null}
                    </div>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>From: {ticket.customer_name}</p>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        <Clock size={14} /> {new Date(ticket.created_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
                    {getStatusBadge(ticket.status)}
                    {getPriorityBadge(ticket.priority)}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
