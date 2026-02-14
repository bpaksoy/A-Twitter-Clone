# A-Twitter-Clone

A full-stack Twitter-like social network application built with **Django** (Backend) and **React** (Frontend).

## Features

- **Tweet Feed**: View all tweets from all users.
- **Posting**: Registered users can post new tweets.
- **User Profiles**: View individual user profiles with their tweet history.
- **Follow System**: Follow and unfollow other users.
- **Following Feed**: View a curated feed of tweets only from users you follow.
- **Likes**: Like and unlike tweets (coming soon / partially implemented).
- **Pagination**: Navigate through tweets with a paginated list.
- **Authentication**: Secure login and registration system.

## Project Structure

- `network/`: Django app containing the backend logic, models, and API views.
- `frontend/`: React application for the user interface.
- `project4/`: Django project configuration.

## Setup and Installation

### Prerequisites

- Python 3.9+ 
- Node.js & npm

### Backend Setup (Django)

1. **Activate Virtual Environment**:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```

2. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Database Migrations**:
   ```bash
   python manage.py migrate
   ```

4. **Run Server**:
   ```bash
   python manage.py runserver
   ```
   The backend will be available at `http://127.0.0.1:8000`.

### Frontend Setup (React)

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Build the Application**:
   ```bash
   npm run build
   ```
   The build files will be served by Django from the `frontend/build` directory.

## Troubleshooting

- **CORS Issues**: If you experience CORS errors, ensure you are accessing the application via `http://127.0.0.1:8000` (consistent with the backend settings). The frontend is configured to use relative paths for API calls to avoid cross-origin conflicts.
- **Duplicate Migrations**: If you encounter conflicting migration errors, ensure there are no duplicate migration files (e.g., files ending in ` 2.py`) in the `network/migrations/` directory.

## License

MIT
