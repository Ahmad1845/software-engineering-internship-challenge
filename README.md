# SupportDesk - Mini Customer Support Ticket System

This repository contains the solution for the Software Engineering Internship Challenge at Sectem Technologies.

## Declaration
> I confirm that I completed this challenge without using generative AI, an AI coding assistant, or an AI-enabled editor. I understand the submitted code and can explain and modify it.

## Project Overview
SupportDesk is a full-stack web application designed to help companies manage customer support requests efficiently. It allows customers to submit support tickets and enables support agents to view, filter, sort, and update the status of these tickets. It also includes an automatic urgent ticket detection system and a real-time dashboard for statistics.

## Technology Stack
- **Frontend**: React (Vite) with Vanilla CSS (Dark mode implemented)
- **Backend**: Node.js with Express.js
- **Database**: SQLite
- **Testing**: Jest and Supertest

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- npm

### 1. Database Setup & Backend
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend server (this will automatically create the SQLite database `supportdesk.db`):
   ```bash
   npm start
   ```
   *The backend will run on `http://localhost:5000`.*

### 2. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *The frontend will be accessible at the URL provided by Vite (typically `http://localhost:5173`).*

## API Endpoint Summary

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/tickets` | Creates a new support ticket. Validates input and flags urgent tickets. |
| `GET` | `/api/tickets` | Retrieves a list of tickets. Supports query params: `search`, `priority`, `status`, `sort`. |
| `GET` | `/api/tickets/:id` | Retrieves full details of a specific ticket by ID. |
| `PATCH`| `/api/tickets/:id/status` | Updates the status of a specific ticket (Open, In Progress, Resolved). |
| `GET` | `/api/dashboard` | Retrieves aggregate statistics (Total, Open, In Progress, Resolved, Urgent). |

## How to run the tests
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Run the test suite:
   ```bash
   npm test
   ```
*Tests cover urgent-ticket detection, validation, status updates, and invalid status handling.*

## Problem-Solving Requirement: Duplicate Email Decision
**Decision**: Allow the new ticket.

**Explanation**: 
When a user submits a ticket with an email address that already exists, the system permits the creation of the new ticket without blocking it.

- **Benefits**: This approach offers the best customer experience. It is very common for a single customer to have multiple distinct issues over time (or even simultaneously). Blocking the ticket would frustrate users who genuinely need help with a new problem. Linking tickets by displaying them when searched by email allows agents to see the user's history organically.
- **Disadvantages**: It could potentially lead to spam if a user submits many duplicate tickets maliciously. However, this is better mitigated at the network/rate-limiting level rather than blocking legitimate multi-issue customers.

## Initiative Requirement: Dark Mode
**Feature Added**: Dark Mode Support

**Why I selected it**:
I selected Dark Mode because modern web applications are expected to provide this option for user comfort. It significantly improves accessibility and reduces eye strain for support agents who may look at the dashboard for hours at a time. It also satisfies the challenge's request for a clean, functional, but modern design.

**What problem it solves**:
It solves the problem of visual fatigue in bright environments and caters to user preference, offering a seamless toggle that persists across sessions using `localStorage`.

**What I would improve further**:
In the future, I would sync the theme with the user's operating system preferences automatically via `prefers-color-scheme` media query on initial load, and perhaps allow customizable color accents for different company brands.

## Assumptions Made
- The application is meant for a single-tenant support team (no complex authentication or role-based access control was implemented, as per requirements).
- Local timezone is acceptable for ticket creation dates.
