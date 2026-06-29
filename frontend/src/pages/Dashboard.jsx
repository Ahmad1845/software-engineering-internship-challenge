import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Ticket, Monitor, MoreHorizontal, CheckCircle, AlertTriangle } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

export default function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({ total: 0, open: 0, inProgress: 0, resolved: 0, urgent: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const statsRes = await axios.get(`${API_URL}/dashboard`);
      setStats(statsRes.data);

      const ticketsRes = await axios.get(`${API_URL}/tickets?sort=newest`);
      setTickets(ticketsRes.data.tickets.slice(0, 5)); // Just show recent 5
    } catch (error) {
      console.error('Failed to fetch data', error);
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
      return <span className="badge badge-priority-medium">NORMAL</span>; // Map medium to normal like screenshot
    }
    return <span className="badge badge-priority-low">LOW</span>;
  };

  const formatTicketId = (id) => {
    return `TKT-${String(id).padStart(4, '0')}`;
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard Overview</h1>
        <p className="page-subtitle">Here is a summary of your queue today.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-box">
          <div className="stat-header">
            <Ticket size={16} /> Total Tickets
          </div>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-subtext" style={{ color: 'var(--primary-blue)' }}>↗ +12% this week</div>
        </div>

        <div className="stat-box">
          <div className="stat-header">
            <Monitor size={16} /> Open Tickets
          </div>
          <div className="stat-value">{stats.open}</div>
          <div className="stat-subtext">Needs assignment</div>
        </div>

        <div className="stat-box">
          <div className="stat-header">
            <MoreHorizontal size={16} /> In Progress
          </div>
          <div className="stat-value">{stats.inProgress}</div>
          <div className="stat-subtext">Currently being worked on</div>
        </div>

        <div className="stat-box">
          <div className="stat-header">
            <CheckCircle size={16} /> Resolved
          </div>
          <div className="stat-value">{stats.resolved}</div>
          <div className="stat-subtext" style={{ color: 'var(--primary-blue)' }}>↗ +5% vs last week</div>
        </div>

        <div className="stat-box urgent-box">
          <div className="stat-header">
            <AlertTriangle size={16} /> Urgent
          </div>
          <div className="stat-value">{stats.urgent}</div>
          <div className="stat-subtext">Immediate action required</div>
        </div>
      </div>

      <div className="card">
        <div className="table-header-flex">
          <h2 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Recent Tickets</h2>
          <Link to="/tickets" style={{ fontSize: '0.875rem', color: 'var(--primary-blue)', fontWeight: '600', textDecoration: 'none' }}>
            View All
          </Link>
        </div>
        
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Subject</th>
                  <th>Priority</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map(ticket => (
                  <tr key={ticket.id}>
                    <td className="td-id">
                      <Link to={`/ticket/${ticket.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {formatTicketId(ticket.id)}
                      </Link>
                    </td>
                    <td>{ticket.customer_name}</td>
                    <td>{ticket.subject}</td>
                    <td>{getPriorityBadge(ticket.priority, ticket.is_urgent)}</td>
                    <td>{getStatusBadge(ticket.status)}</td>
                  </tr>
                ))}
                {tickets.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No recent tickets.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
