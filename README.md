# HealthSurgeAI

**Predicting Healthcare Surges. Saving Lives.**

HealthSurgeAI is an agentic AI system designed for Indian hospitals to forecast patient influx during festivals, pollution spikes, and epidemics. It provides a dashboard for administrators to view predicted loads vs. current capacity and recommends actionable steps like staffing adjustments and resource allocation.

## Project Structure

- **Frontend**: React (Vite) + Tailwind CSS
- **Backend (API)**: Python (FastAPI/Uvicorn)
- **Database & Auth**: Convex

## Getting Started

### Prerequisites

- Node.js & npm
- Python 3.8+
- Convex Account (for backend/auth)

### 1. Frontend & Convex Setup

The frontend is built with React and Vite, and uses Convex for real-time data and authentication.

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run Development Server**:
    This command runs both the Vite frontend and Convex backend in parallel.
    ```bash
    npm run dev
    ```
    - Frontend: `http://localhost:5173`
    - Convex Dashboard: Automatically opens or runs in background.

### 2. Python Backend Setup

The Python backend handles the predictive engine and external API integrations.

1.  **Navigate to Backend Directory**:
    ```bash
    cd backend
    ```

2.  **Install Python Dependencies**:
    (Ensure you have a virtual environment active if preferred)
    ```bash
    pip install fastapi uvicorn pandas numpy tensorflow scikit-learn
    # Add other dependencies as needed based on imports in main.py
    ```

3.  **Run the Python Server**:
    ```bash
    uvicorn main:app --reload --port 8002
    ```
    - API URL: `http://localhost:8002`

## Key Commands

| Component | Command | Description |
| :--- | :--- | :--- |
| **Full Stack** | `npm run dev` | Runs React Frontend + Convex Backend |
| **Frontend Only** | `npm run dev:frontend` | Runs only the Vite dev server |
| **Convex Only** | `npm run dev:backend` | Runs only the Convex dev server |
| **Python API** | `uvicorn main:app --reload --port 8002` | Runs the Python FastAPI server |

## Features

- **Surge Prediction**: Forecasts patient influx using LSTM models.
- **Resource Optimization**: Recommends staffing and bed allocation.
- **Proactive Alerts**: SMS & Email notifications for staff.
- **Real-time Dashboard**: Live view of hospital capacity and predicted surges.
