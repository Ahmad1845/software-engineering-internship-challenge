const Database = require('better-sqlite3');
const path = require('path');

// Check if we are running the test suite
const isTest = process.env.NODE_ENV === 'test';

// If we are testing, use an in-memory database so we don't mess up our real data
// Otherwise, create a file called supportdesk.db in the backend folder
const dbPath = isTest ? ':memory:' : path.resolve(__dirname, 'supportdesk.db');

// Connect to the database using the better-sqlite3 library
const db = new Database(dbPath, { verbose: isTest ? null : console.log });

if (!isTest) {
    console.log('Connected to the SQLite database using better-sqlite3.');
}

// Create the tickets table if it doesn't already exist
// We define the structure of our tickets here with basic SQL
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

// Export the database connection so other files can use it
module.exports = db;
