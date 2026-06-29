# SupportDesk - Mini Customer Support Ticket System

SupportDesk is a simple, full-stack web application designed for support teams to manage and track customer tickets. 

## Features
- **Dashboard:** View quick statistics on total, open, in-progress, resolved, and urgent tickets.
- **Ticket Management:** Create new tickets, view all tickets with status/priority filters, and update ticket statuses.
- **Automated Urgency Detection:** Tickets are automatically flagged as "Urgent" if the priority is High or if the word "urgent" is detected in the description.

## Technology Stack
- **Frontend:** React (Vite), React Router, Vanilla CSS
- **Backend:** Node.js, Express
- **Database:** SQLite (using `better-sqlite3`)
- **Testing:** Jest, Supertest

## How to Run the Project Locally

### 1. Start the Backend
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install the necessary dependencies:
   ```bash
   npm install
   ```
3. (Optional) Run the database seed script to populate the system with dummy data:
   ```bash
   node seed.js
   ```
4. Start the backend server:
   ```bash
   npm start
   ```
   The backend API will run on `http://localhost:5000`.

### 2. Start the Frontend
1. Open a separate terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and go to `http://localhost:5173`.

### 3. Run the Tests
To run the automated backend tests:
```bash
cd backend
npm test
```

## API Endpoint Summary
- `POST /api/tickets` - Create a new support ticket.
- `GET /api/tickets` - Retrieve all tickets (supports `search` query parameter).
- `GET /api/tickets/:id` - Retrieve a specific ticket by its ID.
- `PATCH /api/tickets/:id` - Update a ticket's status (e.g., from Open to Resolved).
- `GET /api/tickets/dashboard/stats` - Retrieve aggregate statistics for the dashboard.

## Assumptions Made
- The system is currently designed for internal support agents, so there is no authentication or login required at this stage.
- All agents have equal permissions and can view/update any ticket.
- SQLite is sufficient for the MVP and local development scale.

## Duplicate Email Decision
- **Decision:** Duplicate emails *are* allowed in the system.
- **Reasoning:** A single customer might encounter multiple different issues over time and need to submit multiple tickets. Enforcing unique emails at the database level would prevent customers from submitting more than one request. 

## Known Limitations
- No user authentication or role-based access control (RBAC).
- File attachments (like screenshots of an issue) cannot currently be uploaded.
- SQLite is used locally, meaning it cannot be easily deployed across horizontally scaled, distributed servers without migrating to PostgreSQL or MySQL.

## What I Would Build Next
- **Authentication (JWT):** To track exactly *which* support agent resolved a ticket.
- **Email Notifications:** Automatically email the customer when their ticket status is updated to "Resolved".
- **Pagination:** Implement `LIMIT` and `OFFSET` in the backend so the frontend table doesn't load every historical ticket at once.

## Initiative Requirement

### 1. What you added
I implemented a **System-wide Dark Mode** feature. Users can click the Moon/Sun icon in the top right navigation bar to instantly toggle the entire application between a light theme and a dark theme.

### 2. Why you selected it
Support agents often stare at screens for 8-10 hours a day. Giving them the ability to switch to a darker interface significantly improves accessibility and user comfort.

### 3. What problem it solves
It reduces eye strain during long shifts, especially in low-light environments, and provides a modern, premium feel to the dashboard that users have come to expect from professional SaaS products.

### 4. What you would improve further
Currently, the dark mode state is reset if the user refreshes the page. In the future, I would save their preference in the browser's `localStorage` or `sessionStorage` so that the application remembers their chosen theme across sessions.

## Time Log

- **Planning:** 30 minutes
- **Backend and database:** 2 hours 15 minutes
- **Frontend:** 2 hours 15 minutes
- **Testing:** 30 minutes
- **Documentation and improvements:** 45 minutes
- **Total:** 6 hours 15 minutes

## Declaration

I confirm that I completed this challenge without using generative AI, an AI coding assistant, or an AI-enabled editor. I understand the submitted code and can explain and modify it.
