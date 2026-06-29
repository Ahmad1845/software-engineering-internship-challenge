const express = require('express');
const router = express.Router();
const db = require('../database');

// A simple helper function to figure out if a ticket is urgent
function isUrgent(priority, description) {
    // It's urgent if priority is High
    if (priority === 'High') {
        return true;
    }
    
    // Also urgent if they typed the word "urgent" in the description
    // We convert description to lowercase so we don't have to worry about capital letters
    if (description && description.toLowerCase().includes('urgent')) {
        return true;
    }
    
    return false;
}

// 1. Create a Support Ticket (POST /api/tickets)
router.post('/tickets', function(req, res) {
    // Get the data from the user's request body
    const customer_name = req.body.customer_name;
    const customer_email = req.body.customer_email;
    const subject = req.body.subject;
    const description = req.body.description;
    const priority = req.body.priority;

    // Validate the input data to make sure everything is there
    const errors = [];
    if (!customer_name) {
        errors.push('Customer name is required');
    }
    
    // Basic regex email validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!customer_email || !emailRegex.test(customer_email)) {
        errors.push('Valid customer email is required');
    }
    
    if (!subject) {
        errors.push('Subject is required');
    }
    
    if (!description || description.length < 10) {
        errors.push('Description must contain at least 10 characters');
    }
    
    if (priority !== 'Low' && priority !== 'Medium' && priority !== 'High') {
        errors.push('Priority must be Low, Medium, or High');
    }

    // If there are errors, stop here and tell the user
    if (errors.length > 0) {
        return res.status(400).json({ errors: errors });
    }

    // Determine if we need to mark it as urgent
    let urgentValue = 0;
    if (isUrgent(priority, description)) {
        urgentValue = 1;
    }

    // Save the ticket to our SQLite database using better-sqlite3
    try {
        const sql = `
            INSERT INTO tickets (customer_name, customer_email, subject, description, priority, is_urgent) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const stmt = db.prepare(sql);
        const result = stmt.run(customer_name, customer_email, subject, description, priority, urgentValue);
        
        // Send a success message back to the frontend with the new ticket's ID
        res.status(201).json({
            message: 'Ticket created successfully',
            ticketId: result.lastInsertRowid
        });
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ error: err.message });
    }
});

// 2. Ticket Listing (GET /api/tickets)
router.get('/tickets', function(req, res) {
    // Get the filters from the URL query
    const search = req.query.search;
    const priority = req.query.priority;
    const status = req.query.status;
    const sort = req.query.sort;
    
    // Start building our SQL query
    let sql = "SELECT id, customer_name, subject, priority, status, created_date, is_urgent FROM tickets WHERE 1=1";
    const params = [];

    // Add search filter if the user typed something in the search bar
    if (search) {
        sql = sql + " AND (customer_name LIKE ? OR customer_email LIKE ? OR subject LIKE ?)";
        const searchPattern = "%" + search + "%";
        params.push(searchPattern, searchPattern, searchPattern);
    }
    
    // Add priority filter if selected in dropdown
    if (priority) {
        sql = sql + " AND priority = ?";
        params.push(priority);
    }
    
    // Add status filter if selected in dropdown
    if (status) {
        sql = sql + " AND status = ?";
        params.push(status);
    }

    // Sort the results by date based on what user selected
    if (sort === 'oldest') {
        sql = sql + " ORDER BY created_date ASC";
    } else {
        sql = sql + " ORDER BY created_date DESC";
    }

    // Run the query and return the tickets
    try {
        const stmt = db.prepare(sql);
        const rows = stmt.all(...params); // Pass in all our parameters dynamically
        res.json({ tickets: rows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Ticket Detail (GET /api/tickets/:id)
router.get('/tickets/:id', function(req, res) {
    try {
        // Get the specific ticket by its ID from the URL path parameter
        const sql = "SELECT * FROM tickets WHERE id = ?";
        const stmt = db.prepare(sql);
        const row = stmt.get(req.params.id);
        
        // If no ticket is found, return 404 Not Found error
        if (!row) {
            return res.status(404).json({ error: 'Ticket not found' });
        }
        
        // Send the single ticket back
        res.json({ ticket: row });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. Status Update (PATCH /api/tickets/:id/status)
router.patch('/tickets/:id/status', function(req, res) {
    const status = req.body.status;
    
    // Make sure the new status is a valid option before updating
    if (status !== 'Open' && status !== 'In Progress' && status !== 'Resolved') {
        return res.status(400).json({ error: 'Invalid status value' });
    }

    try {
        // Update the status and change the updated_date to right now
        const sql = "UPDATE tickets SET status = ?, updated_date = CURRENT_TIMESTAMP WHERE id = ?";
        const stmt = db.prepare(sql);
        const result = stmt.run(status, req.params.id);
        
        // If changes === 0, that means the ticket didn't exist
        if (result.changes === 0) {
            return res.status(404).json({ error: 'Ticket not found' });
        }
        
        res.json({ message: 'Status updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. Dashboard Statistics (GET /api/dashboard)
router.get('/dashboard', function(req, res) {
    try {
        // Get counts for all the different statistics using SQL
        // We use SUM and CASE WHEN to conditionally count tickets with specific statuses
        const sql = `
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'Open' THEN 1 ELSE 0 END) as open_count,
                SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) as in_progress_count,
                SUM(CASE WHEN status = 'Resolved' THEN 1 ELSE 0 END) as resolved_count,
                SUM(CASE WHEN is_urgent = 1 THEN 1 ELSE 0 END) as urgent_count
            FROM tickets
        `;
        const stmt = db.prepare(sql);
        const row = stmt.get();
        
        // Return the numbers to the dashboard (use || 0 to avoid sending nulls)
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
