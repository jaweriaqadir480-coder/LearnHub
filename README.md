
# LearnHub – Learning Management System

LearnHub is a MERN Stack based Learning Management System (LMS) developed as a final project for Hunarmand Punjab Batch 3.

The platform allows students to explore courses, enroll in courses, access lessons, and track their learning progress. Admins and instructors can manage courses and lessons through their dashboards.

## Features

### Authentication
- User registration and login
- Password hashing using Bcrypt
- JWT-based authentication
- Role-based access control

### User Roles
- Admin
- Instructor
- Student

### Course Management
- Add new courses
- View available courses
- Update course details
- Delete courses
- Add lessons to courses

### Student Dashboard
- Browse available courses
- Enroll in courses
- View enrolled courses
- Access course lessons
- Mark lessons as completed
- Track course progress

## Technologies Used

### Frontend
- React.js
- JavaScript
- Axios
- CSS
- Vite

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- Bcrypt.js

## Project Structure

```text
LearnHub/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── index.html
│   └── package.json
│
├── .gitignore
└── README.md
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/jaweriaqadir480-coder/LearnHub.git
```

### 2. Backend Setup

```bash
cd LearnHub/backend
npm install
```

Create a `.env` file inside the backend folder and add your own configuration:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Start the backend:

```bash
npm start
```

### 3. Frontend Setup

Open another terminal:

```bash
cd LearnHub/frontend
npm install
npm run dev
```

Open the local URL displayed by Vite in your browser.

## API Overview

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |
| GET | /api/courses | Get courses |
| POST | /api/enrollments | Enroll in course |
| GET | /api/enrollments/my-courses | Get enrolled courses |
| POST | /api/enrollments/complete-lesson | Complete a lesson |

Additional admin and instructor routes are available for course and lesson management.

## Security

- Passwords are hashed before storage.
- JWT is used for authentication.
- Protected routes restrict unauthorized access.
- Role-based middleware controls access to admin and instructor features.
- Environment variables are used for sensitive configuration.

## Author

**Jaweria Qadir**

Hunarmand Punjab – Batch 3  
MERN Stack Web Development

## Repository

https://github.com/jaweriaqadir480-coder/LearnHub
