# Lumn Backend

This is the backend API for the Lumn app. It uses Node.js, Express, and Postgres.

## Structure

- `server.js` — Main entry point
- `models/` — Database connection and models
- `routes/` — API endpoints

## Setup

1. Copy `.env.example` to `.env` and fill in your Postgres credentials.
2. Run `npm install` in this folder.
3. Start the server with `npm run dev` (for development) or `npm start` (for production).

## Example API

- `GET /api/health` — Health check
- `GET /api/data` — Example Postgres query (see `routes/example.js`)
