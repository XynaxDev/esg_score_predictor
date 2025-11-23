<div align="center">
	<h1>ESG Analytics Dashboard</h1>

  <img alt="React" src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img alt="Flask" src="https://img.shields.io/badge/Flask-3.0-000000?style=for-the-badge&logo=flask&logoColor=white" />
  <img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img alt="Tailwind" src="https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img alt="Docker" src="https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
  <img alt="License" src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" />

<p align="center">
  A modern analytics platform for Environmental, Social, and Governance performance monitoring
</p>

<p>
  <a href="#-features">Features</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="https://github.com/XynaxDev/esg_score_predictor
/issues">Report Bug</a> •
  <a href="https://github.com/XynaxDev/esg_score_predictor
/issues">Request Feature</a>
</p>
</div>

---

## ✨ Features

- **Interactive ESG Leaderboard**  
Real-time ranking of top performers with drill-down capabilities and year-over-year tracking

- **Advanced Analytics**  
Industry benchmarking, regional comparison, and trend forecasting

- **Environmental Metrics**  
Carbon emissions, resource efficiency, and energy consumption monitoring

- **Financial Integration**  
ESG-financial correlation analysis with market performance indicators

- **Smart Filtering**  
Multi-dimensional data filtering with custom thresholds and industry-specific views

---

## 🚀 Quick Start

### Prerequisites

📦 Python 3.11+  
📦 Node.js 18+  
📦 MongoDB (Atlas or local)  
📦 Git

### Backend Setup (Flask)
```bash
# Create virtual environment
python -m venv .venv
.venv\Scripts\activate  # Windows
source .venv/bin/activate  # Mac/Linux

# Install dependencies
pip install -r backend/requirements.txt

# Configure environment
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and secret key

# Run server
python app.py
# Backend runs on http://localhost:5000
```

### Frontend Setup (React + Vite)
```bash
cd frontend
npm install

# Configure environment
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000

# Run dev server
npm run dev
# Frontend runs on http://localhost:5173
```

---

## 🛠️ Tech Stack

**Frontend**  
React 18 • Vite • Tailwind CSS • Framer Motion • Recharts

**Backend**  
Flask • Flask-CORS • JWT Auth • Flask-Mail • Flask-PyMongo

**Database**  
MongoDB Atlas

**Analytics**  
Pandas • NumPy

**DevOps**  
Docker • GitHub Actions

---

## 📁 Project Structure
```
esg_score_predictor/
├── backend/
│   ├── app/                # Flask blueprints & extensions
│   ├── app.py             # Development entry point
│   ├── wsgi.py            # Production entry point
│   ├── Dockerfile         # Container configuration
│   └── requirements.txt
├── frontend/
│   ├── src/               # React components
│   ├── public/            # Static assets
│   └── package.json
├── data/                  # Sample CSV datasets
├── notebook/              # Analysis notebooks
└── LICENSE
```

---

## 📊 Dashboard Sections

### Overview Dashboard
- High-level ESG metrics, sustainability leaderboard, KPIs, and financial impact analysis

### Industry Analysis
- Sector-wise comparisons, resource efficiency metrics, and competitive benchmarking

### Regional Performance
- Geographic distribution, compliance tracking, and regional trends

### Trend Analysis
- Historical data visualization, predictive insights, and performance forecasting

---

## 🐳 Docker Deployment
```bash
cd backend
docker build -t esg-backend .
docker run -e PORT=5000 -e MONGO_URI="your-mongo-uri" -p 5000:5000 esg-backend
```

---

## 🔧 Environment Variables

### Backend (.env)
```env
MONGO_URI=your_mongodb_connection_string
SECRET_KEY=your_secret_key_here
PORT=5000
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASSWORD=your_password
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
```

---

## 📝 Available Scripts

### Backend
```bash
python app.py              # Development server
gunicorn -b 0.0.0.0:5000 wsgi:app  # Production server
```

### Frontend
```bash
npm run dev               # Development server
npm run build             # Production build
npm run preview           # Preview production build
npm run lint              # Run ESLint
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

Built with modern web technologies  
Powered by open-source community  
Inspired by sustainable business practices

---

<div align="center">

### ⭐ If this project helped you, consider giving it a star!

### Made with 💚 for a sustainable future

**Let's build a better tomorrow!** 🌱

[![GitHub](https://img.shields.io/badge/GitHub-XynaxDev-181717?style=social&logo=github)](https://github.com/XynaxDev)

</div>
