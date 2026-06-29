import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Clock, User, Mail, AlertCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState(false);

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const fetchTicket = async () => {
    try {
      const res = await axios.get(`${API_URL}/tickets/${id}`);
      setTicket(res.data.ticket);
    } catch (error) {
      console.error('Failed to fetch ticket', error);
      if (error.response && error.response.status === 404) {
        navigate('/'); // Redirect if not found
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatusUpdating(true);
    try {
      await axios.patch(`${API_URL}/tickets/${id}/status`, { status: newStatus });
      fetchTicket(); // Refetch to get updated dates
    } catch (error) {
      console.error('Failed to update status', error);
      alert('Failed to update status');
    } finally {
      setStatusUpdating(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Loading ticket details...</div>;
  }

  if (!ticket) return null;

  return (
    <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/" className="btn btn-outline" style={{ display: 'inline-flex', padding: '0.25rem 0.75rem' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>

      <div className="card" style={{ borderTop: ticket.is_urgent ? '4px solid var(--priority-high)' : `4px solid var(--accent-color)` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <h2 style={{ margin: 0 }}>{ticket.subject}</h2>
              {ticket.is_urgent ? <span className="badge badge-urgent"><AlertCircle size={14} style={{ display: 'inline', marginRight: '4px' }}/> URGENT</span> : null}
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <User size={14} /> {ticket.customer_name}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Mail size={14} /> {ticket.customer_email}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Clock size={14} /> Created: {new Date(ticket.created_date).toLocaleString()}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minWidth: '150px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Status</span>
              <select 
                className="form-select" 
                value={ticket.status} 
                onChange={handleStatusChange} 
                disabled={statusUpdating}
                style={{ fontWeight: '600' }}
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Priority</span>
              <span className={`badge badge-${ticket.priority.toLowerCase()}`} style={{ display: 'inline-block', width: '100%', textAlign: 'center', padding: '0.5rem' }}>
                {ticket.priority}
              </span>
            </div>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '2rem 0' }} />

        <div>
          <h4 style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Description</h4>
          <div style={{ whiteSpace: 'pre-wrap', backgroundColor: 'var(--bg-primary)', padding: '1.5rem', borderRadius: '0.375rem', border: '1px solid var(--border-color)', lineHeight: '1.6' }}>
            {ticket.description}
          </div>
        </div>
        
        <div style={{ marginTop: '2rem', textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          Last updated: {new Date(ticket.updated_date).toLocaleString()}
        </div>
      </div>
    </div>
  );
}
