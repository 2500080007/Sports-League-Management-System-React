# Sports League Management System

A role-based Sports League Management System built with **React** and **Vite**, using `localStorage` for authentication and tournament data persistence, and deployed on **Vercel**.

## Live Demo

- **Vercel Deployment:** [https://sports-league-management-system-mu.vercel.app/](https://sports-league-management-system-mu.vercel.app/)
- **Demo Admin Credentials:** `admin@gmail.com` / `admin123` (or click **Demo Admin**)
- **Demo User Credentials:** `fan@gmail.com` / `fan123` (or click **Demo User**)

## Key Features

- **Role-Based Authentication (`localStorage`):** Sign up and log in as **Admin** or **User**, with saved account persistence and route protection (`/admin` and `/user`).
- **Tournament & Cap Leaders:** Tracks upcoming fixtures, match scorecards, live standings/NRR, **Rohit Sharma** (Orange Cap), and **Sunil Narine** (Purple Cap).
- **Admin Module (`/admin`):** Manage teams and players, schedule matches, run live match simulations or post results, and auto-calculate standings and playoff brackets.
- **User Module (`/user`):** View live points/NRR and playoff brackets, predict match winners to earn Fan XP, and filter or search players.

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