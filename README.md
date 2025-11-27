# CampusCare

A full-stack campus management app for admins and teachers.

## Features
- *Authentication*: Admin/Teacher register, login, first-admin bootstrap, list teachers.
- *Students*: CRUD and management endpoints.
- *Teachers*: CRUD, role-based access controls.
- *Events*: Create and manage campus events.
- *Library (Books)*: Manage books inventory.
- *Infrastructure*: Manage assets/infrastructure records.
- *Notices*: Publish and manage notices.

## Tech Stack
- *Frontend*: React 18, Vite, React Router, Axios
- *Backend*: Node.js, Express, Mongoose, JWT, bcrypt, CORS, dotenv
- *Database*: MongoDB

## Project Structure
- client/ React app (Vite)
- server/ Express API (/api/* routes)

## Prerequisites
- Node.js 18+
- MongoDB (Atlas or local)

## Environment Variables
Create server/.env:
- MONGO_URI= your MongoDB connection string
- JWT_SECRET= secret for JWT signing
- PORT=5000 (optional)

Optional client/.env (for non-proxy or production builds):
- VITE_API_URL= base URL to backend (e.g. https://your-backend.com)

## Install & Run (Development)
Terminal 1 (backend):

cd server
npm install
npm run dev


Terminal 2 (frontend):

cd client
npm install
npm run dev

Vite runs on http://localhost:5173 and proxies /api to http://localhost:5000.

Mobile testing on same Wi‑Fi: open http://<your-laptop-LAN-IP>:5173 on your phone. Vite is configured with host: true and /api proxy.

## Build (Frontend)

cd client
npm run build
npm run preview


## Useful Server Scripts
From server/:
- npm run start – start API
- npm run dev – start with nodemon
- npm run seed:students – seed demo students
- npm run seed:admin – seed initial admin
- npm run reset:admin – reset admin password (defaults: admin@campuscare.com Admin@123)

## API Overview
Base URL: /api
- POST /auth/register – Register (first admin open; later restricted by role)
- POST /auth/login – Login
- GET  /auth/admin-exists – { exists: boolean }
- GET  /auth/teachers – List teachers (admin/teacher)
- /* /students – Student management
- /* /teachers – Teacher management
- /* /events – Events management
- /* /books – Library management
- /* /infrastructure – Infrastructure management
- /* /notices – Notices management

Note: See server/routes/*.js and controllers for exact fields and auth rules.

## Troubleshooting
- *No response on mobile*: ensure phone and laptop are on same network and open http://<LAN-IP>:5173. Backend must run on 5000. Vite proxy is enabled.
- *Database connect error*: verify MONGO_URI in server/.env.
- *JWT errors*: set JWT_SECRET and re-login.

## License
MIT
