# TodoSphere - Modern Task Management

A full-stack task management application built with React and Node.js. Now featuring advanced project management capabilities.

## Project Structure

```
todoflow/
├── frontend/                 # React + TypeScript + Vite
│   ├── components/           # Reusable UI components
│   │   ├── views/            # List, Kanban, Calendar, Gantt, Grid views
│   │   └── ...
│   ├── pages/                # Page components
│   ├── services/             # API service layer
│   └── ...
│
├── backend/                  # Node.js + Express + MongoDB
│   └── src/
│       ├── config/           # Database configuration
│       ├── controllers/      # Request handlers
│       ├── middleware/       # Auth & error middleware
│       ├── models/           # Mongoose schemas (Todo, Board, Comment, User)
│       ├── routes/           # API route definitions
│       └── server.js         # Express server entry
│
└── README.md
```

## Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)

### Backend Setup

```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Edit .env with your MongoDB URI and JWT secret
# MONGODB_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret_key
# PORT=5001

npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` and the backend on `http://localhost:5000`.

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, TypeScript, Vite, React Router |
| **Backend** | Node.js, Express, MongoDB, Mongoose |
| **Auth** | JWT (JSON Web Tokens), bcryptjs |

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user (protected) |

### Boards
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/boards` | Get all boards |
| GET | `/api/boards/:id` | Get single board |
| POST | `/api/boards` | Create new board |
| PUT | `/api/boards/:id` | Update board |
| DELETE | `/api/boards/:id` | Delete board |

### Todos & Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/todos/:boardId` | Get todos for board |
| GET | `/api/todos/item/:id` | Get single todo details |
| POST | `/api/todos` | Create new todo |
| PUT | `/api/todos/item/:id` | Update todo (status, priority, etc) |
| DELETE | `/api/todos/item/:id` | Delete todo |

### Subtasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/todos/item/:id/subtask` | Add subtask |
| PUT | `/api/todos/item/:id/subtask/:subtaskId` | Toggle subtask |
| DELETE | `/api/todos/item/:id/subtask/:subtaskId` | Delete subtask |

### Comments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/comments/:todoId` | Get comments for task |
| POST | `/api/comments` | Add comment |
| DELETE | `/api/comments/:id` | Delete comment |

## Features

- ✅ **Multiple Views**: List, Kanban, Calendar, Gantt, and Grid/Spreadsheet views
- ✅ **Advanced Task Details**: Priority levels, descriptions, due dates, and tags
- ✅ **Subtasks**: Break down tasks into smaller steps with progress tracking
- ✅ **Recurring Tasks**: Daily, weekly, monthly, or custom repetition
- ✅ **Activity & Comments**: collaborate and track history on tasks
- ✅ **User Authentication**: Secure Signup/Login with JWT
- ✅ **Board Management**: Organize tasks into multiple boards
- ✅ **Real-time Updates**: Optimistic UI updates for smooth experience
- ✅ **Protected Routes**: Secure access to user data
- ✅ **Persistent Sessions**: Stay logged in across refreshes

## Environment Variables

### Backend (.env)
```
MONGODB_URI=your_mongodb_connection_string # Place your MongoDB URL here
JWT_SECRET=your_jwt_secret_key # Place your JWT secret key here
PORT=5001
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```
