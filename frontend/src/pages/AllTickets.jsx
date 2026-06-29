import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import { Download, AlertTriangle } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

export default function AllTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortFilter, setSortFilter] = useState('newest');

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    fetchTickets();
  }, [statusFilter, priorityFilter, sortFilter, searchQuery]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (priorityFilter) params.append('priority', priorityFilter);
      if (searchQuery) params.append('search', searchQuery);
      params.append('sort', sortFilter);

      const ticketsRes = await axios.get(`${API_URL}/tickets?${params.toString()}`);
      setTickets(ticketsRes.data.tickets);
    } catch (error) {
      console.error('Failed to fetch tickets', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const classMap = {
      'Open': 'badge-status-open',
      'In Progress': 'badge-status-progress',
      'Resolved': 'badge-status-resolved'
    };
    return <span className={`badge ${classMap[status]}`}>{status.toUpperCase()}</span>;
  };

  const getPriorityBadge = (priority, isUrgent) => {
    if (isUrgent || priority === 'High') {
      return <span className="badge badge-priority-high">HIGH</span>;
    }
    if (priority === 'Medium') {
      return <span className="badge badge-priority-medium">NORMAL</span>;
    }
    return <span className="badge badge-priority-low">LOW</span>;
  };

  const formatTicketId = (id) => {
    return `TKT-${String(id).padStart(4, '0')}`;
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">All Tickets</h1>
          <p className="page-subtitle">Manage and track all customer support requests.</p>
        </div>
        <button className="btn-export">
          <Download size={16} /> Export
        </button>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <select className="form-select" style={{ width: '150px' }} value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
              <option value="">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <select className="form-select" style={{ width: '150px' }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
            <select className="form-select" style={{ width: '150px' }} value={sortFilter} onChange={(e) => setSortFilter(e.target.value)}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Showing 1-{tickets.length} of {tickets.length} tickets
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading tickets...</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Customer</th>
                  <th>Subject</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map(ticket => (
                  <tr key={ticket.id} style={{ borderLeft: ticket.is_urgent ? '4px solid var(--priority-high-text)' : '4px solid transparent' }}>
                    <td className="td-id" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Link to={`/ticket/${ticket.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {formatTicketId(ticket.id)}
                      </Link>
                      {ticket.is_urgent && <AlertTriangle size={14} color="var(--priority-high-text)" />}
                    </td>
                    <td>
                      <div style={{ fontWeight: '500' }}>{ticket.customer_name}</div>
                    </td>
                    <td>{ticket.subject}</td>
                    <td>{getPriorityBadge(ticket.priority, ticket.is_urgent)}</td>
                    <td>{getStatusBadge(ticket.status)}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{new Date(ticket.created_date).toLocaleString()}</td>
                  </tr>
                ))}
                {tickets.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No tickets found matching your criteria.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="pagination">
          <button className="btn-text" style={{ color: 'var(--text-muted)' }}>&lt; Previous</button>
          <div className="page-numbers">
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">3</button>
            <span style={{ padding: '0 0.5rem', display: 'flex', alignItems: 'center' }}>...</span>
            <button className="page-btn">125</button>
          </div>
          <button className="btn-text">Next &gt;</button>
        </div>
      </div>
    </div>
  );
}
