import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api';

export default function CreateTicket() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    subject: '',
    description: '',
    priority: 'Low'
  });
  
  const [errors, setErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setIsSubmitting(true);
    
    // Frontend validation
    const newErrors = [];
    if (!formData.customer_name) newErrors.push('Customer name is required');
    if (!formData.customer_email || !/^\S+@\S+\.\S+$/.test(formData.customer_email)) newErrors.push('Valid customer email is required');
    if (!formData.subject) newErrors.push('Subject is required');
    if (!formData.description || formData.description.length < 10) newErrors.push('Description must contain at least 10 characters');
    
    if (newErrors.length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/tickets`, formData);
      navigate(`/ticket/${res.data.ticketId}`);
    } catch (err) {
      if (err.response && err.response.data.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors(['An unexpected error occurred.']);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Create Support Ticket</h2>
      
      <div className="card">
        {errors.length > 0 && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '0.375rem', marginBottom: '1.5rem', border: '1px solid var(--priority-high)' }}>
            <h4 style={{ color: 'var(--priority-high)', marginBottom: '0.5rem' }}>Please fix the following errors:</h4>
            <ul style={{ color: 'var(--priority-high)', marginLeft: '1.5rem', fontSize: '0.875rem' }}>
              {errors.map((err, idx) => <li key={idx}>{err}</li>)}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Customer Name</label>
            <input type="text" name="customer_name" className="form-input" value={formData.customer_name} onChange={handleChange} placeholder="John Doe" required />
          </div>
          
          <div className="form-group">
            <label className="form-label">Customer Email</label>
            <input type="email" name="customer_email" className="form-input" value={formData.customer_email} onChange={handleChange} placeholder="john@example.com" required />
          </div>

          <div className="form-group">
            <label className="form-label">Subject</label>
            <input type="text" name="subject" className="form-input" value={formData.subject} onChange={handleChange} placeholder="Brief description of the issue" required />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea name="description" className="form-textarea" rows="5" value={formData.description} onChange={handleChange} placeholder="Detailed explanation of the issue (min 10 characters)" required />
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Note: Including the word "urgent" will automatically flag this ticket for immediate review.
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Priority</label>
            <select name="priority" className="form-select" value={formData.priority} onChange={handleChange}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button type="button" className="btn btn-outline" onClick={() => navigate('/')}>Cancel</button>
            <button type="submit" className="btn" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
