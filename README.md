# Patient Admission Management App

A full-stack web application for hospital staff to manage admitted patients — built with **React + Tailwind CSS** on the frontend and **Python (FastAPI)** on the backend, using **Prisma Postgres** as the database.

---

## 🏥 Features

| # | Feature | Status |
|---|---------|--------|
| 1 | **Add a patient** (with full validation) | ✅ Built |
| 2 | **View list of all patients** | ✅ Built |
| 3 | **Filter by Ward, Department, Doctor** (and Status) | ✅ Built |
| 4 | **Search patients by name** | ✅ Built |
| 5 | **Edit a patient** | ✅ Built |
| 6 | **Delete a patient** (with confirmation dialog) | ✅ Built |
| 7 | **Mark a patient as Discharged** | ✅ Built |
| 8 | **Responsive design** (mobile, tablet, desktop) | ✅ Built |

### Validation (Frontend + Backend)

| Field | Rule |
|-------|------|
| Name | Required, letters and spaces only |
| Age | Required, integer between 0–120 |
| Gender | Required, select from list |
| Ward | Required, select from list |
| Department | Required, select from list |
| Doctor | Required, select from list |
| Admission Date | Required, cannot be a future date |

- **Frontend**: Validated with [Zod](https://zod.dev/) before submission
- **Backend**: Validated with [Pydantic](https://docs.pydantic.dev/) — rejects invalid data with clear error messages
- Error messages are displayed inline in the form

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js (Vite), Tailwind CSS v4, Zod, Axios, React Hot Toast, React Icons |
| **Backend** | Python 3, FastAPI, Pydantic |
| **Database** | Prisma Postgres (PostgreSQL via Prisma ORM) |
| **ORM** | Prisma Client Python (async) |

---

## 🎨 Design

- **Dark mode** with an **orange/amber + grey** color theme
- Fully **responsive**: table view on desktop/tablet, card view on mobile
- Smooth modal animations, hover effects, and status badges
- No authentication required (as per spec)

---

## 📂 Project Structure

```
patient-admission-app/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma        # Database schema
│   ├── main.py                  # FastAPI application & routes
│   ├── schemas.py               # Pydantic validation schemas
│   ├── requirements.txt         # Python dependencies
│   └── .env                     # Environment variables (DB connection)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx       # App header with Add button
│   │   │   ├── Filters.jsx      # Search bar + filter dropdowns
│   │   │   ├── PatientTable.jsx  # Table (desktop) + Cards (mobile)
│   │   │   ├── PatientForm.jsx   # Add/Edit modal form with Zod validation
│   │   │   └── ConfirmModal.jsx  # Delete confirmation modal
│   │   ├── api.js               # Axios API client
│   │   ├── validation.js        # Zod validation schema
│   │   ├── App.jsx              # Main app component
│   │   ├── main.jsx             # Entry point
│   │   └── index.css            # Tailwind imports + theme
│   ├── .env                     # Frontend environment variables
│   ├── vite.config.js           # Vite + Tailwind plugin
│   └── package.json
├── .gitignore
└── README.md
```

---

## 🚀 Steps to Run Locally

### Prerequisites

- **Node.js** ≥ 18 & **pnpm** (or npm)
- **Python** ≥ 3.10
- A **Prisma Postgres** database (or any PostgreSQL instance)

### 1. Clone the repo

```bash
git clone https://github.com/AnkurPathak10/patient-admission-app
cd patient-admission-app
```

### 2. Backend Setup

```bash
cd backend

# Create a virtual environment
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up your .env file with your database connection strings
# Edit backend/.env and paste your Prisma Postgres URLs

# Generate Prisma Client & push schema to database
prisma generate
prisma db push

# Start the backend server
uvicorn main:app --reload --port 8000
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
pnpm install

# Start the dev server
pnpm dev
```

The frontend runs on `http://localhost:5173` and the backend on `http://localhost:8000`.

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

```env
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=YOUR_API_KEY"
DIRECT_DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
FRONTEND_URL="http://localhost:5173"
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:8000
```

---

## 📋 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/options` | Get dropdown options (genders, wards, departments, doctors) |
| `GET` | `/api/patients` | List all patients (supports `?search=`, `?ward=`, `?department=`, `?doctor=`, `?status=`) |
| `GET` | `/api/patients/:id` | Get a single patient |
| `POST` | `/api/patients` | Create a new patient |
| `PUT` | `/api/patients/:id` | Update a patient |
| `PATCH` | `/api/patients/:id/discharge` | Mark patient as discharged |
| `DELETE` | `/api/patients/:id` | Delete a patient |

---
