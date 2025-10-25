# 💰 BudgetTracker - Personal Finance Manager

A modern, full-stack budget tracking application built with React, FastAPI, and Docker. Take control of your finances with beautiful visualizations and intuitive budgeting tools.

![BudgetTracker Dashboard](https://img.shields.io/badge/Status-Production_Ready-success)
![License](https://img.shields.io/badge/License-MIT-blue)
![Docker](https://img.shields.io/badge/Deployment-Docker-informational)

## 🚀 Features

### ✨ Core Functionality

- **💰 Transaction Management** - Track income and expenses with categories
- **📊 Budget Planning** - Set monthly budgets with visual progress tracking
- **📈 Data Visualization** - Interactive charts for spending analysis
- **🔐 Secure Authentication** - JWT-based user registration and login
- **🌙 Dark/Light Theme** - System preference detection with manual toggle

### 🛠 Technical Features

- **📱 Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **🐳 Docker Containerization** - Easy deployment with Docker Compose
- **⚡ Fast Performance** - Optimized with modern React patterns
- **🎯 Type Safety** - Full TypeScript implementation
- **🔒 Security** - Password hashing, input validation, and CORS protection

## 🛠 Tech Stack

### Frontend

- **React 18** - Modern React with hooks
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **Chart.js** - Data visualization library
- **Axios** - HTTP client for API calls
- **Vite** - Fast build tool and dev server

### Backend

- **FastAPI** - Modern, fast web framework for Python
- **SQLAlchemy** - SQL toolkit and ORM
- **PostgreSQL** - Primary database (with SQLite fallback)
- **Alembic** - Database migration tool
- **JWT** - JSON Web Token authentication
- **Pydantic** - Data validation and settings management

### DevOps

- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Web server and reverse proxy

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for development)
- Python 3.11+ (for development)

### Production Deployment

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd budget-tracker
   ```
2. **Start with Docker Compose**
   ```bash
   docker-compose up --build
   ```
3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Development Setup

**Backend Development:**

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python run.py
```

**Frontend Development:**

```bash
cd frontend
npm install
npm run dev
```

## API Documentation

_The backend provides a complete REST API with automatic documentation:_

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 🎨 UI/UX Features

### Theme System

- **Automatic Detection:** Detects system dark/light mode preference
- **Manual Toggle:** Users can switch themes manually
- **Persistence:** Theme choice saved in localStorage
- **Smooth Transitions:** CSS transitions for theme changes

### Responsive Design

- **Mobile-First:** Optimised for mobile devices
- **Tablet Support:** Adaptive layouts for tablets
- **Destop Experience:** Full-featured desktop interface

### Data Visualisation

- **Category Spending:** Doughnut chart for expense categories
- **Monthly Trends:** Bar chart for spending over time
- **Budget Progress:** Visual progress bars for budget tracking

## 🔒 Security Features

- **Password Hashing:** bcrypt for secure password storage

- **JWT Tokens:** Stateless authentication with expiration

- **CORS Protection:** Configured for production and development

- **Input Validation:** Both frontend and backend validation

- **SQL Injection Protection:** ORM-based queries with SQLAlchemy

## 🐳 Docker Deployment

# Production Stack

- **Frontend:** Nginx serving built React app

- **Backend:** FastAPI with Uvicorn server

- **Database:** PostgreSQL with persistent volume

- **Reverse Proxy:** Nginx for API routing

# Development

- **Hot Reloading:** Frontend and backend development servers

- **Database:** SQLite for easy development setup

- **Debug Mode:** Enhanced logging and error messages

## 🚀 Deployment Options

1. **Local Deployment**

   ```bash
   # Backend
   cd backend && python run.py

   # Frontend
   cd frontend && npm run dev
   ```

2. **Docker Development**

   ```bash
   docker-compose up --build
   ```

3. **Production Deployment**

   ```bash
   # Set environment variables
   export DATABASE_URL=postgresql://user:pass@host:5432/db
   export SECRET_KEY=your-secret-key

   docker-compose -f docker-compose.prod.yml up -d
   ```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** `(git checkout -b feature/amazing-feature)`
3. **Commit your changes** `(git commit -m 'Add amazing feature')`
4. **Push to the branch** `(git push origin feature/amazing-feature)`
5. **Open a Pull Request**

## 📝 License

This project is licensed under the MIT License

## 👩‍💻

## Elizabeth Kodjo

- Portfolio: [Updated later]
- LinkedIn: [Update later]
- GitHub: [@LizKodjo](https://github.com/LizKodjo)

## 🙏Acknowledgments

- Icons by [Twemoji](https://github.com/twitter/twemoji)
- Charts by [Chart.js](https://www.chartjs.org/)
- UI components by [Tailwind CSS](https://tailwindcss.com/)
