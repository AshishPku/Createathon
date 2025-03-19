# Coding Platform

A web-based coding platform built with Django REST Framework (backend) and React (frontend). Users can solve coding challenges, submit solutions, and track their progress through a dashboard.

## Features

- **IDE**: Interactive code editor with support for multiple languages (JavaScript, Python, Java, etc.).
- **Submissions**: Submit code solutions to challenges via API.
- **Dashboard**: View submission history, progress stats, and achievements.
- **Authentication**: Token-based authentication for secure user access.

## Project Structure

createathon/
├── backend/  
│ ├── createathon/  
│ ├── creathon/  
│ └── manage.py
├── frontend/  
│ ├── src/
│ │ ├── components/  
│ │ └── ...
│ ├── public/
│ └── package.json
├── .gitignore
└── README.md

## Create and Activate Virtual Environment

python -m venv venv
source venv/bin/activate

## Install Dependencies

pip install django djangorestframework django-cors-headers pyjwt

## setup

cd backend
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
cd ../frontend
npm install
npm install axios react-router-dom @monaco-editor/react react-split lucide-react @radix-ui/react-select @radix-ui/react-tabs jwt-decode
npx shadcn-ui@latest init
npx shadcn-ui@latest add button select card tabs
npm start

# Coding Platform API Documentation

Simple RESTful API documentation for the Coding Platform, built with Django REST Framework.

## Base URL

- `/api/auth/` (e.g., `http://127.0.0.1:8000/api/auth/`)

## Authentication

- Uses JWT (Bearer Token) for protected endpoints.
- Header: `Authorization: Bearer <access_token>`

## API Endpoints

### 1. Register User

- **URL**: `/register/`
- **Method**: `POST`
- **Auth**: No
- **Purpose**: Create a new user.
- **Request**: `{"email": "user@example.com", "username": "user", "password": "pass123"}`
- **Response**: `{"id": 1, "email": "user@example.com", "username": "user"}`

### 2. Login

- **URL**: `/login/`
- **Method**: `POST`
- **Auth**: No
- **Purpose**: Get access and refresh tokens.
- **Request**: `{"email": "user@example.com", "password": "pass123"}`
- **Response**: `{"refresh": "<refresh_token>", "access": "<access_token>"}`

### 3. Refresh Token

- **URL**: `/token/refresh/`
- **Method**: `POST`
- **Auth**: No
- **Purpose**: Get a new access token.
- **Request**: `{"refresh": "<refresh_token>"}`
- **Response**: `{"access": "<new_access_token>"}`

### 4. Protected View

- **URL**: `/protected/`
- **Method**: `GET`
- **Auth**: Yes
- **Purpose**: Test authenticated access.
- **Response**: `{"message": "You are authenticated!"}`

### 5. List Users

- **URL**: `/users/`
- **Method**: `GET`
- **Auth**: Yes
- **Purpose**: Get all users.
- **Response**: `[{"id": 1, "username": "user1"}, {"id": 2, "username": "user2"}]`

### 6. User Details

- **URL**: `/users/<int:id>/`
- **Method**: `GET`
- **Auth**: Yes
- **Purpose**: Get details of a specific user.
- **Response**: `{"id": 1, "username": "user1", "email": "user1@example.com"}`

### 7. List Questions

- **URL**: `/questions/`
- **Method**: `GET`
- **Auth**: Yes
- **Purpose**: Get all questions.
- **Response**: `[{"id": 1, "title": "Two Sum"}, {"id": 2, "title": "Reverse String"}]`

### 8. Question Details

- **URL**: `/questions/<int:pk>/`
- **Method**: `GET`
- **Auth**: Yes
- **Purpose**: Get a specific question.
- **Response**: `{"id": 1, "title": "Two Sum", "description": "Solve this..."}`

### 9. Submit Code

- **URL**: `/submissions/`
- **Method**: `POST`
- **Auth**: Yes
- **Purpose**: Submit a code solution.
- **Request**: `{"question_id": 1, "code": "def solution():...", "languages": "python"}`
- **Response**: `{"message": "Submission created", "submission": {"id": 1, "status": "pending"}}`

### 10. User Submissions

- **URL**: `/submissions/user/`
- **Method**: `GET`
- **Auth**: Yes
- **Purpose**: Get current user's submissions.
- **Response**: `{"count": 1, "submissions": [{"id": 1, "question_id": 1, "status": "pending"}]}`

## Notes

- **Error Responses**:
  - `401 Unauthorized`: Missing or invalid token.
  - `404 Not Found`: Resource doesn’t exist.
  - `400 Bad Request`: Invalid input data.
- Use tools like Postman or cURL to test these endpoints.
