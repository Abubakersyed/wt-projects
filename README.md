# DuneCinema Movie Ticket Booking

A full-stack movie ticket booking website built with Node.js, Express, and vanilla JavaScript. Data is stored in local JSON files.

## Setup

1. Install dependencies:
   ```
   npm install
   ```
2. Configure environment:
   ```
   copy .env.example .env
   ```
3. Start server:
   ```
   npm start
   ```
4. Open http://localhost:3000

## Features
- User registration/login with bcrypt and sessions
- Movie listing, search, filters
- Movie details with shows
- Interactive seat selection
- Simulated checkout and booking confirmation
- Booking history and cancellation
- Profile management

## Storage
JSON files in data/: users.json, movies.json, theatres.json, shows.json, bookings.json. Auto-initialized on first run.

## Troubleshooting
- If port 3000 in use, set PORT in .env.
- Delete data/*.json to reseed.
- Ensure Node.js 18+.
