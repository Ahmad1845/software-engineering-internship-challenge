const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, 'supportdesk.db');
const db = new Database(dbPath);

console.log('Seeding database...');

// Clear existing tickets to avoid duplicates if run multiple times
db.exec('DELETE FROM tickets');

const tickets = [
    { customer_name: 'Acme Corp', customer_email: 'contact@acme.com', subject: 'System outage on main server cluster', description: 'Urgent: The main production server is completely unreachable causing downtime.', priority: 'High', status: 'Open', is_urgent: 1 },
    { customer_name: 'Globex Inc', customer_email: 'support@globex.com', subject: 'Unable to access billing dashboard', description: 'The invoice batch processor is getting stuck and we cannot view the dashboard.', priority: 'Medium', status: 'In Progress', is_urgent: 0 },
    { customer_name: 'Stark Industries', customer_email: 'admin@stark.com', subject: 'Password reset request for admin account', description: 'Please reset the admin password for our primary account.', priority: 'Low', status: 'Open', is_urgent: 0 },
    { customer_name: 'Wayne Enterprises', customer_email: 'it@wayne.com', subject: 'Data corruption in recent backup', description: 'We noticed some corrupted files in the weekly backup archive. URGENT please check.', priority: 'High', status: 'In Progress', is_urgent: 1 },
    { customer_name: 'Initech', customer_email: 'bill@initech.com', subject: 'Printer installation on 3rd floor', description: 'Need help installing the new printer drivers on the third floor machines.', priority: 'Medium', status: 'Resolved', is_urgent: 0 },
    { customer_name: 'Soylent Corp', customer_email: 'db@soylent.com', subject: 'Data sync failing across all regional databases', description: 'Urgent issue with regional data synchronization failing repeatedly.', priority: 'High', status: 'In Progress', is_urgent: 1 },
    { customer_name: 'Umbrella Corp', customer_email: 'api@umbrella.com', subject: 'API rate limit exceeded warning emails', description: 'We keep receiving rate limit warnings but traffic is low.', priority: 'Medium', status: 'Open', is_urgent: 0 },
];

const insert = db.prepare(`
    INSERT INTO tickets (customer_name, customer_email, subject, description, priority, status, is_urgent, created_date) 
    VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now', '-' || (abs(random()) % 10) || ' days'))
`);

const insertMany = db.transaction((tickets) => {
    for (const ticket of tickets) {
        insert.run(ticket.customer_name, ticket.customer_email, ticket.subject, ticket.description, ticket.priority, ticket.status, ticket.is_urgent);
    }
});

insertMany(tickets);

console.log('Seeding complete! Added ' + tickets.length + ' dummy tickets.');
