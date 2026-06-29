const Database = require('better-sqlite3');
const path = require('path');

const isTest = process.env.NODE_ENV === 'test';
const dbPath = isTest ? ':memory:' : path.resolve(__dirname, 'supportdesk.db');

const db = new Database(dbPath, { verbose: isTest ? null : console.log });

if (!isTest) {
    console.log('Connected to the SQLite database (better-sqlite3).');
}

// Ensure the table exists
db.exec(`
    CREATE TABLE IF NOT EXISTS tickets (
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
    )
`);

module.exports = db;
