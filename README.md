# SmartDine RMS - Complete Restaurant Management System

## 🚀 Quick Start (All features work!)

### Backend (Flask API + SQLite)

```bash
cd server
venv\Scripts\activate.bat
python app.py
```

**Port: 5000**

- Test: `curl http://localhost:5000/`
- Register: `curl -X POST http://localhost:5000/register -H "Content-Type: application/json" -d "{\"username\":\"admin\",\"email\":\"a@test.com\",\"password\":\"pass\"}"`

### Frontend (React + Tailwind)

```bash
cd client
npm install
npm run dev
```

**Port: 5173**

### Features LIVE:

- ✅ Login/Register (JWT)
- ✅ Menu management (CRUD)
- ✅ Table status
- ✅ Inventory
- ✅ Dashboard charts
- ✅ Navbar tab switching
- ✅ API connected (Menu tab loads data)

### ML Services (Ready)

```bash
cd ml_services/recommendations
pip install -r requirements-ml.txt
uvicorn app:app --reload --port 8001
```

## Tech Stack

- **Frontend**: React 18 + Vite + TailwindCSS + Chart.js + D3.js
- **Backend**: Flask + SQLAlchemy + JWT + SocketIO-ready
- **DB**: SQLite (temp) / MySQL ready
- **ML**: FastAPI + scikit-learn + HuggingFace

## Blueprint Complete

All core + unique features implemented & tested.

**Open browser: localhost:5173 → Login → Explore tabs!** 🎉
