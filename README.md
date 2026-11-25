# Sports League Management System

A role-based Sports League Management System built with **React** and **Vite**, using `localStorage` for authentication and tournament data persistence, and configured for deployment on **Vercel**.

## Key Features

- **Role-Based Authentication (`localStorage`):** Sign up and log in as **Admin** or **User**, with saved credentials pre-filling on future logins and route protection (`/admin` and `/user`).
- **Live Broadcast Ticker & Tournament Overview:** Displays upcoming fixtures, completed match scorecards, and live league standings.
- **Admin Module (`/admin`):**
  - Add and remove color-coded franchises and players.
  - Schedule fixtures and run a 20-over live match simulator or post manual scorecards.
  - Auto-calculates points, Net Run Rate (NRR), and Top-4 playoff bracket seeding.
- **User Module (`/user`):**
  - View the live points table, NRR bars, and playoff qualification bracket.
  - Predict upcoming match winners and earn Fan XP.
  - Filter squad players by role, search by name/team, and track Orange Cap, Purple Cap, and MVP scores.

## Tech Stack

- React + Vite
- React Router (`react-router-dom`)
- Lucide Icons (`lucide-react`)
- Browser `localStorage`
- Vercel (`vercel.json` SPA rewrite rules)

## Run Locally

```bash
npm install
npm run dev