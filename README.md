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

## Initiative Requirement

### 1. What you added
I implemented an **Export tickets to CSV** functionality on the "All Tickets" page. Users can click the "Export to CSV" button to download their currently viewed tickets as a `.csv` file.

### 2. Why you selected it
Support teams frequently need to analyze data offline, share reports with management, or import ticket data into tools like Microsoft Excel or Tableau.

### 3. What problem it solves
It frees data from being locked inside the dashboard. Instead of manually copying and pasting ticket rows to create a report, agents can instantly generate a structured CSV file that respects their active filters (e.g., exporting only "High" priority tickets).

### 4. What you would improve further
Currently, the export happens purely on the frontend and only exports the tickets currently visible in the table. In the future, I would move the CSV generation logic to the backend (e.g., via a `/api/tickets/export` endpoint) so users can export the *entire* database of historical tickets all at once.

## Declaration

I confirm that I completed this challenge without using generative AI, an AI coding assistant, or an AI-enabled editor. I understand the submitted code and can explain and modify it.
