## Quiz System

A full-stack quiz management application with React frontend and Django REST backend.

## Features

*   Create quizzes with multiple choice and true/false questions
*   Share quiz links with participants
*   Auto-grading with detailed results
*   JWT-based authentication for admin access

## Tech Stack

*   **Frontend**: React 19, Material-UI, Vite, Axios
*   **Backend**: Django 4.2, Django REST Framework, Postges
*   **Auth**: JWT (djangorestframework-simplejwt)

## Getting Started

### Backend Setup

```plaintext
cd Backend
pip install -r requirements.txt
python3 manage.py migrate
python3 manage.py runserver
```

Backend runs at `http://localhost:8000`

### Frontend Setup

```plaintext
cd Frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

## API Endpoints

### Authentication

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/auth/signup/` | Register new user |
| POST | `/api/auth/login/` | Login and get JWT tokens |
| POST | `/api/auth/refresh/` | Refresh access token |

### Quizzes

| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| POST | `/api/quizzes/` | Create a quiz | Required |
| GET | `/api/quizzes/{id}/` | Get quiz for taking | No |
| POST | `/api/quizzes/{id}/submit/` | Submit answers | No |

## Authentication Flow

1.  Sign up at `/signup` or login at `/login`
2.  JWT tokens are stored in localStorage
3.  Access token auto-refreshes when expired
4.  Admin page (`/admin`) requires authentication

## Project Structure

```plaintext
├── Backend/
│   ├── quiz/                 # Quiz app (models, views, serializers)
│   ├── quiz_project/         # Django settings
│   └── requirements.txt
├── Frontend/
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── context/          # Auth context
│   │   ├── pages/            # Page components
│   │   └── services/         # API client
│   └── package.json
└── README.md
```