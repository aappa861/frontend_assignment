# Task Manager API Documentation

Base URL: `http://localhost:5000/api` (or your deployed backend URL)

---

## Authentication

Protected routes require the JWT in the header:

```
Authorization: Bearer <your_jwt_token>
```

Obtain the token from **POST /auth/login** or **POST /auth/register** and use it for all other endpoints.

---

## Endpoints

### Auth

#### Register

**POST** `/auth/register`

Creates a new user account.

**Request body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```

**Validation:**

- `name`: required, non-empty
- `email`: required, valid email format
- `password`: required, minimum 6 characters

**Success (201):**

```json
{
  "_id": "64a1b2c3d4e5f6789012345",
  "name": "John Doe",
  "email": "john@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error (400):** `{ "message": "User already exists with this email." }` or validation message.

---

#### Login

**POST** `/auth/login`

Returns user and JWT.

**Request body:**

```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

**Success (200):**

```json
{
  "_id": "64a1b2c3d4e5f6789012345",
  "name": "John Doe",
  "email": "john@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error (401):** `{ "message": "Invalid email or password." }`

---

### Users (protected)

#### Get current user

**GET** `/users/me`

Returns the authenticated user's profile (no password).

**Success (200):**

```json
{
  "_id": "64a1b2c3d4e5f6789012345",
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2024-01-15T10:00:00.000Z"
}
```

**Error (401):** Missing or invalid token.

---

#### Update current user

**PUT** `/users/me`

Update name, email, and/or password. All fields optional.

**Request body (all optional):**

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "newsecret123"
}
```

**Success (200):** Returns updated user object (no password).

**Error (400):** Validation message. **Error (401):** Not authorized.

---

### Tasks (protected)

All task routes are scoped to the authenticated user. Users cannot access or modify other users' tasks.

#### List tasks

**GET** `/tasks`

Query parameters:

| Param   | Type   | Description                    |
|---------|--------|--------------------------------|
| `page`  | number | Page number (default: 1)       |
| `limit` | number | Items per page (default: 10)   |
| `status`| string | Filter: `todo`, `in_progress`, `done` |
| `search`| string | Search by title (case-insensitive)   |

**Example:** `GET /tasks?page=1&limit=10&status=todo&search=meeting`

**Success (200):**

```json
{
  "tasks": [
    {
      "_id": "64a1b2c3d4e5f6789012346",
      "title": "Complete report",
      "description": "Q4 summary",
      "status": "in_progress",
      "user": "64a1b2c3d4e5f6789012345",
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T11:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

---

#### Create task

**POST** `/tasks`

**Request body:**

```json
{
  "title": "New task",
  "description": "Optional description",
  "status": "todo"
}
```

- `title`: required
- `description`: optional
- `status`: optional, one of `todo`, `in_progress`, `done` (default: `todo`)

**Success (201):** Returns the created task object.

**Error (400):** Validation message (e.g. "Title is required").

---

#### Update task

**PUT** `/tasks/:id`

Update an existing task (owner only). Partial payload allowed.

**Request body (all optional):**

```json
{
  "title": "Updated title",
  "description": "Updated description",
  "status": "done"
}
```

**Success (200):** Returns updated task.

**Error (404):** `{ "message": "Task not found or access denied." }`

---

#### Delete task

**DELETE** `/tasks/:id`

Delete a task (owner only).

**Success (200):** `{ "message": "Task deleted." }`

**Error (404):** `{ "message": "Task not found or access denied." }`

---

## Error format

All errors return JSON:

```json
{
  "message": "Human-readable error message"
}
```

In development, the response may also include a `stack` field.

---

## Status codes

| Code | Meaning                    |
|------|----------------------------|
| 200  | OK                         |
| 201  | Created                    |
| 400  | Bad request / validation    |
| 401  | Unauthorized (no/invalid token) |
| 404  | Not found                  |
| 500  | Internal server error      |
