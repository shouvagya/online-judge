# Online Judge

A full-stack Online Judge built from scratch with secure code execution, contest support, authentication, and an online code editor.

Users can solve programming problems, run code against custom input, submit solutions to hidden test cases, participate in contests, and view leaderboards.

---

## Features

### Authentication

- JWT Authentication
- Secure password hashing using bcrypt
- Role-based authorization
- Roles:
  - User
  - Setter
  - Admin

---

### Problems

- Browse all problems
- Difficulty levels
- Tags
- Detailed problem statements
- Sample test cases
- Hidden test cases
- Monaco code editor
- Multiple language support

Supported Languages:

- C++
- Java
- Python

---

### Code Execution

Run code instantly with custom input.

Features:

- Docker sandbox
- CPU limits
- Memory limits
- Process limits
- Network isolation

---

### Submission System

- Submit solutions
- Hidden test case evaluation
- Verdict polling
- Runtime measurement
- Submission history
- Submission details

Supported Verdicts:

- Accepted
- Wrong Answer
- Time Limit Exceeded
- Runtime Error
- Compilation Error

---

### Contests

- Contest creation
- Contest registration
- Contest problems
- Contest submissions
- Leaderboard
- Automatic contest status

---

### Leaderboard

- Contest rankings
- Total score
- Solved problems
- Rank ordering

---

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- React Router
- React Query
- Tailwind CSS
- Monaco Editor

### Backend

- Node.js
- Express
- TypeScript
- Prisma ORM
- MySQL
- Redis
- BullMQ
- JWT

### Judge

- Docker
- GCC
- OpenJDK
- Python

---


## Architecture

```
               React Frontend
                      │
               REST API (Express)
                      │
         ┌────────────┴────────────┐
         │                         │
      MySQL                    Redis
         │                         │
         └────────────┬────────────┘
                      │
                 BullMQ Worker
                      │
               Docker Sandbox
                      │
          Compile → Execute → Judge
```

---

## Security

- JWT Authentication
- Password hashing with bcrypt
- Docker sandboxing
- No network access during execution
- Memory limits
- CPU limits
- Process limits
- Role-based access control

---

## Author

**Shouvagya Saha**
