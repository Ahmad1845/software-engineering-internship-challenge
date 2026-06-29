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
I implemented a **System-wide Dark Mode** feature. Users can click the Moon/Sun icon in the top right navigation bar to instantly toggle the entire application between a light theme and a dark theme.

### 2. Why you selected it
Support agents often stare at screens for 8-10 hours a day. Giving them the ability to switch to a darker interface significantly improves accessibility and user comfort.

### 3. What problem it solves
It reduces eye strain during long shifts, especially in low-light environments, and provides a modern, premium feel to the dashboard that users have come to expect from professional SaaS products.

### 4. What you would improve further
Currently, the dark mode state is reset if the user refreshes the page. In the future, I would save their preference in the browser's `localStorage` or `sessionStorage` so that the application remembers their chosen theme across sessions.

## Declaration

I confirm that I completed this challenge without using generative AI, an AI coding assistant, or an AI-enabled editor. I understand the submitted code and can explain and modify it.
