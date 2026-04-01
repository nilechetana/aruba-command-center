# Aruba Command Center — Auth App

A full-stack Login & Signup authentication web application with a dark enterprise glassmorphism UI, animated network topology background, and a Node.js/Express backend.

---

## Folder Structure

```
aruba-auth-app/
├── frontend/
│   ├── public/
│   │   └── index.html               # HTML entry point, loads Google Fonts
│   └── src/
│       ├── components/
│       │   ├── AuthCard/            # Glassmorphism card with tab switcher
│       │   ├── LoginForm/           # Login form with remember me & validation
│       │   ├── SignupForm/          # Signup form with all fields & strength meter
│       │   ├── InputField/          # Reusable input with icon, error, glow
│       │   ├── PasswordStrength/    # Animated strength bar (Weak/Medium/Strong)
│       │   └── NetworkBackground/  # Animated canvas network topology
│       ├── hooks/
│       │   ├── useForm.js           # Form state, validation, touched tracking
│       │   └── useAuth.js           # API call state (loading, success, error)
│       ├── utils/
│       │   └── validators.js        # Pure validation & password strength functions
│       ├── services/
│       │   └── authService.js       # Axios API calls to backend
│       ├── App.jsx                  # Root layout with brand header
│       ├── App.module.css           # Global CSS variables + layout styles
│       └── main.jsx                 # React DOM entry point with BrowserRouter
│
└── backend/
    ├── controllers/
    │   └── authController.js        # register & login business logic
    ├── middleware/
    │   ├── validateRequest.js       # express-validator chains + error handler
    │   └── errorHandler.js          # Global 500 error handler
    ├── models/
    │   └── User.js                  # In-memory user store with helpers
    ├── routes/
    │   └── authRoutes.js            # POST /register, POST /login routes
    ├── utils/
    │   └── hashPassword.js          # bcryptjs hash & compare helpers
    ├── .env                         # PORT, BCRYPT_SALT_ROUNDS
    └── server.js                    # Express app setup & server start
```

---

## Setup Instructions

### Prerequisites
- Node.js v18+
- npm v9+

### 1. Clone / navigate to the project

```bash
cd aruba-auth-app
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create `backend/.env` (already included):
```
PORT=5000
BCRYPT_SALT_ROUNDS=10
```

Start the backend:
```bash
npm run dev      # uses nodemon (auto-restart)
# or
npm start        # plain node
```

Backend runs at: `http://localhost:5000`

### 3. Frontend setup

```bash
cd ../frontend
npm install
```

Create `frontend/.env` (already included):
```
VITE_API_URL=http://localhost:5000
```

Start the frontend:
```bash
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## Validation Rules

| Field            | Rules |
|------------------|-------|
| Full Name        | Required · Min 3 chars · Letters and spaces only (`/^[a-zA-Z\s]{3,}$/`) |
| Email            | Required · Valid email format (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`) |
| Phone            | Optional · Indian 10-digit starting with 6–9 (`/^[6-9]\d{9}$/`) |
| Password (Login) | Required · Min 8 characters |
| Password (Signup)| Required · Min 8 chars · Must contain: 1 uppercase, 1 lowercase, 1 number, 1 special character |
| Confirm Password | Must exactly match the password field |

### Password Strength Levels

| Score | Conditions Met | Label  | Bar Width | Color  |
|-------|---------------|--------|-----------|--------|
| 1     | 1             | Weak   | 33%       | Red    |
| 2     | 2–3           | Medium | 66%       | Orange |
| 3     | 4             | Strong | 100%      | Green  |

---

## API Endpoints

| Method | URL                    | Request Body                                      | Success Response                                                                 | Error Response |
|--------|------------------------|---------------------------------------------------|----------------------------------------------------------------------------------|----------------|
| POST   | `/api/auth/register`   | `{ name, email, phone?, password }`               | `201 { success: true, message: "Account created successfully", user: { id, name, email } }` | `400` validation errors · `409` email already exists |
| POST   | `/api/auth/login`      | `{ email, password }`                             | `200 { success: true, message: "Login successful", user: { id, name, email } }`  | `400` validation errors · `401` invalid credentials |
| GET    | `/api/health`          | —                                                 | `200 { success: true, message: "Aruba Command Center API is running" }`          | — |

### Example: Register

**Request**
```json
POST /api/auth/register
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "9876543210",
  "password": "Secret@123"
}
```

**Response**
```json
{
  "success": true,
  "message": "Account created successfully",
  "user": {
    "id": "usr_1700000000000_abc1234",
    "name": "Jane Doe",
    "email": "jane@example.com"
  }
}
```

### Example: Login

**Request**
```json
POST /api/auth/login
{
  "email": "jane@example.com",
  "password": "Secret@123"
}
```

**Response**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "usr_1700000000000_abc1234",
    "name": "Jane Doe",
    "email": "jane@example.com"
  }
}
```

---

## Tech Stack

| Layer    | Technology |
|----------|-----------|
| Frontend | React 18, Vite, CSS Modules, Axios, React Router v6 |
| Backend  | Node.js, Express.js, bcryptjs, express-validator, cors, dotenv |
| Database | In-memory array (no external DB required) |
| Fonts    | Exo 2 (headings), DM Sans (body) — Google Fonts |
