import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Send, AlertCircle } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

export default function CreateTicket() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    subject: '',
    description: '',
    priority: 'Medium'
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error for field on change
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    
    // Frontend validation
    if (!formData.customer_name) newErrors.customer_name = 'Customer name is required';
    if (!formData.customer_email || !/^\S+@\S+\.\S+$/.test(formData.customer_email)) newErrors.customer_email = 'Valid customer email is required';
    if (!formData.subject) newErrors.subject = 'Subject is required';
    if (!formData.description || formData.description.length < 10) newErrors.description = 'Description must be at least 10 characters long.';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await axios.post(`${API_URL}/tickets`, formData);
      navigate(`/ticket/${res.data.ticketId}`);
    } catch (err) {
      if (err.response && err.response.data.errors) {
        // Simple mapping for backend errors if needed
        console.error(err.response.data.errors);
        alert('Server error: check console');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Create New Ticket</h1>
        <p className="page-subtitle">Please fill in the details below to submit a new support request.</p>
      </div>
      
      <div className="card form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className={`form-group ${errors.customer_name ? 'form-error' : ''}`} style={{ marginBottom: 0 }}>
              <label className="form-label">CUSTOMER NAME *</label>
              <input 
                type="text" 
                name="customer_name" 
                className="form-input" 
                value={formData.customer_name} 
                onChange={handleChange} 
                placeholder="e.g. Jane Doe" 
              />
              {errors.customer_name && <div className="error-msg"><AlertCircle size={12}/> {errors.customer_name}</div>}
            </div>
            
            <div className={`form-group ${errors.customer_email ? 'form-error' : ''}`} style={{ marginBottom: 0 }}>
              <label className="form-label">CUSTOMER EMAIL *</label>
              <input 
                type="email" 
                name="customer_email" 
                className="form-input" 
                value={formData.customer_email} 
                onChange={handleChange} 
                placeholder="jane@example.com" 
              />
              {errors.customer_email && <div className="error-msg"><AlertCircle size={12}/> {errors.customer_email}</div>}
            </div>
          </div>

          <div className={`form-group ${errors.subject ? 'form-error' : ''}`}>
            <label className="form-label">SUBJECT *</label>
            <input 
              type="text" 
              name="subject" 
              className="form-input" 
              value={formData.subject} 
              onChange={handleChange} 
              placeholder="Brief summary of the issue" 
            />
            {errors.subject && <div className="error-msg"><AlertCircle size={12}/> {errors.subject}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">PRIORITY</label>
            <select name="priority" className="form-select" value={formData.priority} onChange={handleChange}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className={`form-group ${errors.description ? 'form-error' : ''}`}>
            <label className="form-label">DESCRIPTION *</label>
            <textarea 
              name="description" 
              className="form-textarea" 
              rows="6" 
              value={formData.description} 
              onChange={handleChange} 
              placeholder="" 
            />
            {errors.description && (
              <div className="error-msg">
                <AlertCircle size={14}/> {errors.description}
              </div>
            )}
          </div>

          <div className="form-footer">
            <button type="button" className="btn-text" onClick={() => navigate(-1)} style={{ color: '#1a56db' }}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Create Ticket'} <Send size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
