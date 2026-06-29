const express = require('express');
const router = express.Router();
const db = require('../database');

// Helper to determine if urgent
const isUrgent = (priority, description) => {
    return priority === 'High' || (description && description.toLowerCase().includes('urgent'));
};

// 1. Create a Support Ticket
router.post('/tickets', (req, res) => {
    const { customer_name, customer_email, subject, description, priority } = req.body;

    // Validation
    const errors = [];
    if (!customer_name) errors.push('Customer name is required');
    if (!customer_email || !/^\S+@\S+\.\S+$/.test(customer_email)) errors.push('Valid customer email is required');
    if (!subject) errors.push('Subject is required');
    if (!description || description.length < 10) errors.push('Description must contain at least 10 characters');
    if (!['Low', 'Medium', 'High'].includes(priority)) errors.push('Priority must be Low, Medium, or High');

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    const urgent = isUrgent(priority, description) ? 1 : 0;

    try {
        const stmt = db.prepare(`
            INSERT INTO tickets (customer_name, customer_email, subject, description, priority, is_urgent) 
            VALUES (?, ?, ?, ?, ?, ?)
        `);
        const result = stmt.run(customer_name, customer_email, subject, description, priority, urgent);
        
        res.status(201).json({
            message: 'Ticket created successfully',
            ticketId: result.lastInsertRowid
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Ticket Listing (with search, filter, sort)
router.get('/tickets', (req, res) => {
    const { search, priority, status, sort } = req.query;
    
    let sql = `SELECT id, customer_name, subject, priority, status, created_date, is_urgent FROM tickets WHERE 1=1`;
    const params = [];

    if (search) {
        sql += ` AND (customer_name LIKE ? OR customer_email LIKE ? OR subject LIKE ?)`;
        const searchPattern = `%${search}%`;
        params.push(searchPattern, searchPattern, searchPattern);
    }
    if (priority) {
        sql += ` AND priority = ?`;
        params.push(priority);
    }
    if (status) {
        sql += ` AND status = ?`;
        params.push(status);
    }

    if (sort === 'oldest') {
        sql += ` ORDER BY created_date ASC`;
    } else {
        sql += ` ORDER BY created_date DESC`;
    }

    try {
        const stmt = db.prepare(sql);
        const rows = stmt.all(...params);
        res.json({ tickets: rows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Ticket Detail
router.get('/tickets/:id', (req, res) => {
    try {
        const stmt = db.prepare(`SELECT * FROM tickets WHERE id = ?`);
        const row = stmt.get(req.params.id);
        
        if (!row) {
            return res.status(404).json({ error: 'Ticket not found' });
        }
        res.json({ ticket: row });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. Status Update
router.patch('/tickets/:id/status', (req, res) => {
    const { status } = req.body;
    
    if (!['Open', 'In Progress', 'Resolved'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status value' });
    }

    try {
        const stmt = db.prepare(`UPDATE tickets SET status = ?, updated_date = CURRENT_TIMESTAMP WHERE id = ?`);
        const result = stmt.run(status, req.params.id);
        
        if (result.changes === 0) {
            return res.status(404).json({ error: 'Ticket not found' });
        }
        res.json({ message: 'Status updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. General Ticket Update (Optional full update if needed)
router.patch('/tickets/:id', (req, res) => {
    res.status(501).json({ error: 'Not implemented, use /status for status update' });
});

// 6. Dashboard Statistics
router.get('/dashboard', (req, res) => {
    try {
        const stmt = db.prepare(`
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'Open' THEN 1 ELSE 0 END) as open_count,
                SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) as in_progress_count,
                SUM(CASE WHEN status = 'Resolved' THEN 1 ELSE 0 END) as resolved_count,
                SUM(CASE WHEN is_urgent = 1 THEN 1 ELSE 0 END) as urgent_count
            FROM tickets
        `);
        const row = stmt.get();
        
        res.json({
            total: row.total || 0,
            open: row.open_count || 0,
            inProgress: row.in_progress_count || 0,
            resolved: row.resolved_count || 0,
            urgent: row.urgent_count || 0
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
