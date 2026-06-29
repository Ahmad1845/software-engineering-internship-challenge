const request = require('supertest');
const app = require('../server');
const db = require('../database');

beforeAll((done) => {
    // Make sure table is created if using memory DB
    db.run(`CREATE TABLE IF NOT EXISTS tickets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_name TEXT NOT NULL,
        customer_email TEXT NOT NULL,
        subject TEXT NOT NULL,
        description TEXT NOT NULL,
        priority TEXT NOT NULL CHECK(priority IN ('Low', 'Medium', 'High')),
        status TEXT NOT NULL DEFAULT 'Open' CHECK(status IN ('Open', 'In Progress', 'Resolved')),
        is_urgent BOOLEAN DEFAULT 0,
        created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_date DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, done);
});

afterAll((done) => {
    db.close(done);
});

describe('Tickets API', () => {
    let ticketId;

    it('should create a valid ticket and NOT mark it urgent if priority is Low', async () => {
        const res = await request(app)
            .post('/api/tickets')
            .send({
                customer_name: 'Test User',
                customer_email: 'test@example.com',
                subject: 'Login Issue',
                description: 'I am unable to login to my account since yesterday.',
                priority: 'Low'
            });
        
        expect(res.statusCode).toEqual(201);
        expect(res.body.message).toBe('Ticket created successfully');
        ticketId = res.body.ticketId;

        // Check if urgent is false
        const ticketRes = await request(app).get(`/api/tickets/${ticketId}`);
        expect(ticketRes.body.ticket.is_urgent).toBe(0);
    });

    it('should mark a ticket as urgent if priority is High', async () => {
        const res = await request(app)
            .post('/api/tickets')
            .send({
                customer_name: 'Test User 2',
                customer_email: 'test2@example.com',
                subject: 'System Down',
                description: 'The entire system is unreachable.',
                priority: 'High'
            });
        
        expect(res.statusCode).toEqual(201);
        const ticketRes = await request(app).get(`/api/tickets/${res.body.ticketId}`);
        expect(ticketRes.body.ticket.is_urgent).toBe(1);
    });

    it('should mark a ticket as urgent if description contains "urgent" (case-insensitive)', async () => {
        const res = await request(app)
            .post('/api/tickets')
            .send({
                customer_name: 'Test User 3',
                customer_email: 'test3@example.com',
                subject: 'Payment Issue',
                description: 'This is an URGENT request to fix my payment.',
                priority: 'Low' // Priority is Low but description has urgent
            });
        
        expect(res.statusCode).toEqual(201);
        const ticketRes = await request(app).get(`/api/tickets/${res.body.ticketId}`);
        expect(ticketRes.body.ticket.is_urgent).toBe(1);
    });

    it('should fail input validation if fields are missing or invalid', async () => {
        const res = await request(app)
            .post('/api/tickets')
            .send({
                customer_name: '',
                customer_email: 'invalid-email',
                subject: '',
                description: 'short',
                priority: 'Critical'
            });
        
        expect(res.statusCode).toEqual(400);
        expect(res.body.errors).toContain('Customer name is required');
        expect(res.body.errors).toContain('Valid customer email is required');
        expect(res.body.errors).toContain('Subject is required');
        expect(res.body.errors).toContain('Description must contain at least 10 characters');
        expect(res.body.errors).toContain('Priority must be Low, Medium, or High');
    });

    it('should successfully update ticket status', async () => {
        const res = await request(app)
            .patch(`/api/tickets/${ticketId}/status`)
            .send({ status: 'In Progress' });
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toBe('Status updated successfully');

        const ticketRes = await request(app).get(`/api/tickets/${ticketId}`);
        expect(ticketRes.body.ticket.status).toBe('In Progress');
    });

    it('should fail status update with invalid status', async () => {
        const res = await request(app)
            .patch(`/api/tickets/${ticketId}/status`)
            .send({ status: 'Closed' }); // Invalid status
        
        expect(res.statusCode).toEqual(400);
        expect(res.body.error).toBe('Invalid status value');
    });
});
