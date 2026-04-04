# SmartDine RMS - Restaurant Management System

## Overview

Feature-rich RMS with React frontend, Flask backend, MySQL, Python ML services.

## Tech Stack

- Frontend: React + Vite + TailwindCSS + Socket.io-client + Chart.js + D3.js
- Backend: Flask + SQLAlchemy + Flask-SocketIO + JWT
- DB: MySQL
- ML: FastAPI + scikit-learn + HuggingFace Transformers

## Quick Start

**No MySQL needed (SQLite temp)**

1. Backend deps (if not done): `cd server && venv\\Scripts\\activate && pip install -r requirements.txt`
2. Frontend deps (if not done): `cd client && npm install`
3. Run Backend: `cd server && venv\\Scripts\\activate.bat && python app.py` (now SocketIO, port 5000)
4. Run Frontend: `cd client && npm run dev` (localhost:5173)
5. Login with test user, see dashboard tabs: Menu, Live Tables (toggle status, see update in other browser tabs!), Inventory.
6. Backend APIs test with curl as above.
7. ML Service (optional): `cd ml_services/recommendations && python -m venv venv && venv\\Scripts\\activate && pip install -r ..\requirements-ml.txt && uvicorn app:app --reload --port 8001`
8. MySQL upgrade: Install MySQL, .env, change URI.
9. For MySQL later: Install MySQL Installer, update .env, change URI in app.py

## Environment Variables (.env)

```
DB_HOST=localhost
DB_USER=root
DB_PASS=yourpass
DB_NAME=smartdine_rms
SECRET_KEY=your-secret
STRIPE_KEY=pk_test_...
```

## API Docs

Coming soon (Swagger).

See TODO.md for progress.
