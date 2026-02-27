🚀 Task Manager – Full Stack MERN Application

A production-ready full-stack task management application built with the MERN stack.
Includes JWT authentication, protected routes, dark mode, reusable UI components, and scalable backend architecture.

🌟 Live Demo (Optional)

Frontend: https://your-frontend-url.com
Backend API: https://your-api-url.com

📌 Features
🔐 Authentication

User registration & login

JWT authentication (7-day expiry)

Protected routes

Password hashing with bcrypt

👤 User Management

View profile

Update name, email, password

✅ Task Management

Create, read, update, delete tasks

Status types:

todo

in_progress

done

Search by title

Filter by status

Pagination support

🎨 UI & UX

Fully responsive layout

Dark mode (stored in localStorage)

Reusable design system components

Smooth animations

Toast notifications

Loading states

Proper error handling

🛠 Tech Stack
Frontend

React 18

Vite

TailwindCSS

React Router

Axios

React Hot Toast

Backend

Node.js

Express.js

MongoDB

Mongoose

JWT

bcrypt

📁 Project Structure
task-manager/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── docs/
├── postman/
└── README.md
⚙️ Getting Started (Local Setup)
🔹 Prerequisites

Node.js 18+

MongoDB (local or Atlas)

1️⃣ Backend Setup
cd backend
cp .env.example .env

Edit .env:

MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

Then run:

npm install
npm run dev

Backend runs on:

http://localhost:5000
2️⃣ Frontend Setup
cd frontend
cp .env.example .env
npm install
npm run dev

Frontend runs on:

http://localhost:3000
🔐 Environment Variables
Backend (.env)
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret
JWT_EXPIRE=7d
Frontend (.env)
VITE_API_BASE_URL=http://localhost:5000
📡 API Endpoints
Method	Endpoint	Description
POST	/api/auth/register	Register user
POST	/api/auth/login	Login user
GET	/api/users/me	Get current user
PUT	/api/users/me	Update profile
GET	/api/tasks	Get tasks
POST	/api/tasks	Create task
PUT	/api/tasks/:id	Update task
DELETE	/api/tasks/:id	Delete task
🏗 Architecture & Scalability

Stateless REST API

JWT-based authentication

Centralized error handling

User-scoped task data

Ready for horizontal scaling

Can integrate Redis for rate limiting

Docker-ready structure

🛡 Security Practices

Passwords hashed using bcrypt

JWT validated on protected routes

No hardcoded secrets

Environment-based configuration

Input validation on client & server

📦 Production Improvements (Planned)

HTTP-only cookies for JWT

Refresh token rotation

Redis caching

Docker containerization

CI/CD pipeline

Deployment on AWS / Render / Vercel
