# CourseMaster - MERN EdTech Platform

**CourseMaster** is a full-featured E-learning platform built with the MERN stack. It allows students to browse, enroll, and consume video courses, while providing administrators with tools to manage content, curricula, and assess student performance via dynamic quizzes and assignments.

## 🚀 Features Implemented

### Student Portal

- **Course Discovery:** Search by title and filter by category/price (Server-side filtering).
- **Learning Dashboard:** Track enrolled courses and real-time progress bars.
- **Course Player:** Integrated YouTube video player with "Mark as Complete" functionality.
- **Assessments:**
  - **Assignments:** Submit text or Google Drive links for specific courses.
  - **Quizzes:** Take multiple-choice quizzes with instant scoring.

### Admin Dashboard

- **Course Management:** Create, Update, and Delete courses.
- **Curriculum Builder:** Dynamic form to add Lessons (Syllabus), Batches, and **Custom Quizzes** per course.
- **Enrollment Tracking:** View a list of all enrolled students and their progress.
- **Submission Review:** A dedicated dashboard to review student assignments and quiz scores with filtering.

### ⚙️ Technical Highlights

- **Architecture:** Clean Architecture (Controller-Service-Model) on Backend.
- **Validation:** Strict Data Validation using **Zod** (Client & Server).
- **State Management:** **TanStack Query** for caching, loading states, and optimistic updates.
- **Security:** JWT Authentication, RBAC (Role-Based Access Control), and Password Hashing.
- **UI/UX:** Responsive design using **Tailwind CSS** and **Shadcn UI**.

---

## 🛠 Technology Stack

### Frontend

**Framework:** Next.js 14 (App Router)

**Language:** TypeScript

**Styling:** Tailwind CSS, Shadcn UI

**State Management:** TanStack Query (React Query)

**Forms & Validation:** React Hook Form + Zod

### Backend

**Runtime:** Node.js

**Framework:** Express.js

**Database:** MongoDB + Mongoose ODM

**Auth:** JSON Web Tokens (JWT)

**Email Services:** Nodemailer (SMTP)

---

## 📦 Installation & Run Instructions

The project is structured as a monorepo.

### 1. Backend Setup

```cd server
npm install
npm run dev
# Server runs on http://localhost:5000
```

### 2. Frontend Setup

```
cd client
npm install
npm run dev
# App runs on http://localhost:3000
```

## Environment Variables

You need to create a `.env` file in the server/ directory and a `.env`.local file in the client/ directory.

### Backend (server/.env)

```
# Database Connection
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/coursemaster
PORT=5000

# Security
JWT_SECRET=your_super_secret_jwt_key_here

# Email Configuration (Optional - Falls back to Ethereal for testing if left empty)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_SECURE=false
SMTP_FROM="CourseMaster Team"
```

### Frontend (client/.env.local)

```
# API Base URL (Must match backend port)
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Default Admin Credentials (Seeder)

When the server starts for the first time, it automatically creates a default Admin account if one does not exist. Use these credentials to access the Admin Dashboard:

- **Email:** admin@coursemaster.com

- **Password:** adminpassword123

## API Documents

| Method  | Endpoint             | Description                        | Access  |
| :------ | :------------------- | :--------------------------------- | :------ |
| Auth    | `/api/auth/register` | Register a new Student             | Public  |
| Auth    | `/api/auth/login`    | Login (Returns JWT & Role)         | Public  |
| Courses | `/api/courses`       | Search, Filter, and Pagination     | Public  |
| Courses | `/api/courses`       | Create Course (w/ Quiz & Syllabus) | Admin   |
| Enroll  | `/api/enrollments`   | Enroll Student & Init Progress     | Student |
| Enroll  | `/api/enrollments`   | View All Enrollments               | Admin   |
| Subs    | `/api/submissions`   | Submit Assignment/Quiz             | Student |
| Subs    | `/api/submissions`   | View All Submissions               | Admin   |

## Bonus Features Completed

Email Notification: Implemented an automated Welcome Email service using Nodemailer. It supports production SMTP (Gmail/Brevo) and falls back to Ethereal Email for development testing.
