# Task Manager API with frontend App

A REST API project that implements the basic functionality of a Task Manager, ensuring data validation and access control. The project uses the following tools: **Node.js, Express 5, TypeScript (NodeNext), Prisma ORM, PostgreSQL (Supabase), JWT, Zod, bcryptjs, Jest, and Supertest.**

## Main API Features:

*   Registration and login with JWT token support.
*   Creating, editing, and deleting tasks.
*   Tasks contain the following properties:
    *   Title (required)
    *   Description
    *   Status — ToDo, In progress, Done
    *   Deadline
    *   Creation time
    *   Update time
*   Data validation using Zod
*   Integration tests (Jest + Supertest)

## React Application Features:

*   Registration and login
*   Automatic authorization via saved tokens
*   Creating/Editing/Deleting tasks
*   Visual representation of tasks according to their status and deadline time

## Repository Structure

The repository is divided into two parts:

```text
├── backend/  # API
└── frontend/ # React application
```

## 🚀 Setup Instructions

### 1. Backend Preparation

Go to the backend folder:
```bash
cd backend
```

Install dependencies:
```bash
npm install
```

Create a `.env` file in the `backend` folder and add your data (use `.env.example` as a template):
```env
DATABASE_URL="your_postgresql_link"
```

Initialize the database (Prisma):
```bash
npm run db:init
```

Start the server in development mode:
```bash
npm run dev
```

### 2. Frontend Preparation

Open a new terminal window and go to the frontend folder:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Start the application:
```bash
npm run dev
```

## 🧪 Testing (Backend)

To run integration tests, execute the following in the `backend` folder:
```bash
npm run test
```

## 📖 API Documentation (Endpoints)

**Important:** For all routes marked as **(Auth)**, the following header must be added:
`Authorization: Bearer <access_token>`

### 1. Authentication (`/api/auth`)

*   **POST `/api/auth/register`** — Register a new user.
    *   **Body:**
        ```json
        {
          "email": "user@example.com",
          "password": "password123",
          "name": "string"
        }
        ```

*   **POST `/api/auth/login`** — Login.
    *   **Body:**
        ```json
        {
          "email": "user@example.com",
          "password": "password123"
        }
        ```
    *   **Response:** `{ "accessToken": "string", "refreshToken": "string" }`

*   **POST `/api/auth/refresh`** — Refresh tokens.
    *   **Body:**
        ```json
        {
          "refreshToken": "string"
        }
        ```
    *   **Response:** `{ "accessToken": "string", "refreshToken": "string" }`

### 2. Users (`/api/users`)

*   **GET `/api/users`** — Get a list of all users.
*   **GET `/api/users/me` (Auth)** — Get the profile of the current user.
*   **GET `/api/users/:id`** — Get a user by ID.
*   **POST `/api/users`** — Create a user.
    *   **Body:**
        ```json
        {
          "email": "user@example.com",
          "password": "password123",
          "name": "string"
        }
        ```
*   **PUT `/api/users/:id`** — Update user data.
    *   **Body:**
        ```json
        {
          "email": "user@example.com",
          "name": "string"
        }
        ```
*   **DELETE `/api/users/:id`** — Delete a user.

### 3. Tasks (`/api/tasks`)

*   **GET `/api/tasks` (Auth)** — Get all tasks of the current user.
*   **POST `/api/tasks` (Auth)** — Create a new task.
    *   **Body:**
        ```json
        {
          "title": "string",
          "description": "string",
          "status": "TODO",
          "deadline": "2026-01-31T00:00:00.000Z"
        }
        ```
*   **PUT `/api/tasks/:id` (Auth)** — Edit an existing task.
    *   **Body:**
        ```json
        {
          "title": "string",
          "description": "string",
          "status": "IN_PROGRESS",
          "deadline": "2026-01-31T00:00:00.000Z"
        }
        ```
*   **DELETE `/api/tasks/:id` (Auth)** — Delete a task.

## 📄 License

This project is fully open source. You are free to use, copy, and modify it. For more details on the terms of use, read the LICENSE file.
