# Lumn Backend

This is the backend API for the Lumn app. It uses Node.js, Express, and Postgres.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [PostgreSQL](https://www.postgresql.org/) (v13+ recommended)

## Project Structure

- `server.js` — Main entry point
- `models/` — Database connection and models
- `routes/` — API endpoints (okrs, users, teams, updates, keyresults)
- `migrations/` — SQL files for database schema
- `seeds/` — SQL files for sample data
- `scripts/` — Utility scripts (e.g., run-sql.js)

## Setup

1. Copy `.env.example` to `.env` and fill in your Postgres credentials.
2. Install dependencies:

   ```sh
   yarn install
   ```

3. Run database migrations:

   ```sh
   yarn migrate
   ```

4. (Optional) Seed the database:

   ```sh
   yarn seed
   ```

5. Start the server (development):

   ```sh
   yarn dev
   ```

   or for production:

   ```sh
   yarn start
   ```

## Environment Variables

- `DB_USER` — Postgres username
- `DB_PASSWORD` — Postgres password
- `DB_HOST` — Database host (usually `localhost`)
- `DB_PORT` — Database port (default: 5432)
- `DB_NAME` — Database name
- `NODE_ENV` — `development` or `production`
- `PORT` — Port for the backend server (default: 3001)

## API Endpoints

- `GET /api/okrs` — Get OKRs (role-based)
- `GET /api/users` — Get all users
- `GET /api/teams` — Get all teams
- `GET /api/updates/okr/:okrId` — Get updates for an OKR
- `GET /api/keyresults/okr/:okrId` — Get key results for an OKR
- ...and more (see `routes/`)

## Scripts

- `yarn dev` — Start server with nodemon (development)
- `yarn start` — Start server (production)
- `yarn migrate` — Run all SQL migrations in `/migrations`
- `yarn seed` — Run all SQL seeds in `/seeds`

## License

ISC

## Author

Your Name
