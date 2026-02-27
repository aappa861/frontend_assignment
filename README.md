# Task Manager

A production-ready full-stack task management application with JWT authentication, dark mode, and a clean design system.

![Stack](https://img.shields.io/badge/React-18-61dafb?logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646cff?logo=vite)
![Tailwind](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss)
![Node](https://img.shields.io/badge/Node-18+-339933?logo=node.js)
![Express](https://img.shields.io/badge/Express-4-000000?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47a248?logo=mongodb)

---

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [API documentation](#api-documentation)
- [Design system](#design-system)
- [Scripts](#scripts)
- [Scalability & production](#scalability--production)
- [Security](#security)
- [License](#license)

---

## Features

- **Authentication**: Register, login, JWT (7d expiry), protected routes
- **User profile**: View and update name, email, password
- **Tasks**: CRUD with status (`todo`, `in_progress`, `done`), search by title, filter by status, pagination
- **Dark mode**: Toggle with persistence in `localStorage`
- **UI**: Responsive layout, reusable components, smooth animations, Tailwind-based design system
- **Quality**: Client and server validation, error handling, loading states, toast notifications

---

## Tech stack

| Layer     | Technology        |
|----------|-------------------|
| Frontend | React 18, Vite, TailwindCSS, React Router, Axios, React Hot Toast |
| Backend  | Node.js, Express  |
| Database | MongoDB (Mongoose) |
| Auth     | JWT, bcrypt       |

---

## Project structure

```
├── backend/
│   ├── config/          # DB connection
│   ├── controllers/     # Auth, User, Task
│   ├── middleware/      # Auth (JWT), error handler
│   ├── models/         # User, Task
│   ├── routes/         # Auth, User, Task
│   ├── utils/          # generateToken
│   ├── server.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/        # Button, Input, Select, Card, Badge, Loader
│   │   │   ├── layout/    # Navbar, ProtectedRoute
│   │   │   └── tasks/     # TaskForm, TaskList
│   │   ├── context/       # AuthContext, ThemeContext
│   │   ├── hooks/         # useDebounce, etc.
│   │   ├── pages/         # Login, Register, Dashboard
│   │   ├── services/      # api.js (Axios + interceptors)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
├── docs/
│   └── API.md            # API documentation
├── postman/
│   └── Task-Manager-API.postman_collection.json
└── README.md
```

---

## Getting started

### Prerequisites

- **Node.js** 18 or later  
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Backend

```bash
cd backend
cp .env.example .env
# Edit .env: set MONGODB_URI, JWT_SECRET (required)
npm install
npm run dev
```

Server runs at **http://localhost:5000**.

### 2. Frontend

```bash
cd frontend
cp .env.example .env
# Optional: set VITE_API_BASE_URL if not using Vite proxy (default proxies /api to backend)
npm install
npm run dev
```

App runs at **http://localhost:3000**. API requests are proxied to the backend via Vite.

### 3. Postman (optional)

1. Import **`postman/Task-Manager-API.postman_collection.json`** into Postman.
2. Set collection variable `baseUrl` to `http://localhost:5000/api`.
3. After **Login** or **Register**, copy the `token` from the response into the collection variable `token` for protected requests.

---

## Environment variables

### Backend (`.env`)

| Variable      | Description              | Required | Example                    |
|---------------|--------------------------|----------|----------------------------|
| `NODE_ENV`    | Environment              | No       | `development` / `production` |
| `PORT`        | Server port              | No       | `5000`                     |
| `MONGODB_URI` | MongoDB connection string| **Yes**  | `mongodb://localhost:27017/task_manager` |
| `JWT_SECRET`  | Secret for signing JWTs  | **Yes**  | Long random string         |
| `JWT_EXPIRE`  | Token expiry             | No       | `7d`                       |

### Frontend (`.env`)

| Variable            | Description        | Required | Example                 |
|--------------------|--------------------|---------|-------------------------|
| `VITE_API_BASE_URL`| Backend base URL   | No      | `http://localhost:5000`  |

---

## API documentation

Full API reference: **[docs/API.md](docs/API.md)**

| Method | Endpoint              | Auth | Description        |
|--------|------------------------|------|--------------------|
| POST   | `/api/auth/register`   | No   | Register           |
| POST   | `/api/auth/login`     | No   | Login              |
| GET    | `/api/users/me`      | Yes  | Current user       |
| PUT    | `/api/users/me`      | Yes  | Update profile     |
| GET    | `/api/tasks`         | Yes  | List tasks (filter, search, pagination) |
| POST   | `/api/tasks`         | Yes  | Create task        |
| PUT    | `/api/tasks/:id`     | Yes  | Update task        |
| DELETE | `/api/tasks/:id`     | Yes  | Delete task        |

---

## Design system

The frontend uses a small design system under **`frontend/src/components/ui/`**:

- **Button** – Variants: `primary`, `secondary`, `ghost`, `danger`; sizes: `sm`, `md`, `lg`; supports `loading`
- **Input** – Text input / textarea with optional `label` and `error`
- **Select** – Dropdown with `options` and optional `label`
- **Card** – Container with optional `title` and consistent padding/border
- **Badge** – Status pill; variants: `todo`, `in_progress`, `done`, `default`
- **Loader** – Spinner with optional label

All UI components support **dark mode** via Tailwind `dark:` classes. Theme is toggled in the navbar and stored in `localStorage`.

---

## Scripts

### Backend

- `npm run dev` – Start with watch mode  
- `npm start` – Start production server  

### Frontend

- `npm run dev` – Start dev server with HMR  
- `npm run build` – Production build  
- `npm run preview` – Preview production build  

---

## Scalability & production

### Backend

- **Stateless API**: Scale horizontally behind a load balancer; no in-memory session.
- **Redis**: Rate limiting, optional caching, refresh-token revocation.
- **MongoDB**: Replica sets for read scaling; sharding if needed.
- **Docker**: Containerize app and DB; use a reverse proxy (e.g. Nginx) in front.

### Frontend

- **Code splitting**: Use `React.lazy()` and `Suspense` for route-level chunks.
- **CDN**: Serve static assets from a CDN; keep API on a separate origin.
- **Caching**: Long cache for hashed assets; short or no-cache for `index.html`.

### JWT in production

- Prefer **HTTP-only cookies** for the token to reduce XSS risk.
- Use **short-lived access tokens** and **refresh tokens**; optionally store refresh token IDs in Redis for revocation.

### Logging

- Use **Winston** (or similar) with structured JSON logs; ship to a central system (e.g. ELK, Datadog).

---

## Security

- Passwords hashed with **bcrypt**
- **JWT** validated on every protected route
- Secrets in **environment variables** (no hardcoded keys)
- **Central error handler** (no stack traces in production responses)
- Tasks scoped by **user** (no cross-user access)

---

## License

MIT
#   f r o n t e n d _ a s s i g n m e n t  
 