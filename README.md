# 🔒 Botnet Detection System

A comprehensive machine learning-based botnet detection system with a modern web interface, combining Graph Neural Networks (GCN) and LSTM models for network traffic classification.

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Running Locally](#running-locally)
- [API Documentation](#api-documentation)
- [Deployment Guide](#deployment-guide)
- [Usage Guide](#usage-guide)

---

## 🎯 Project Overview

This system detects botnet activities in network traffic using advanced ML models:
- **GCN Model**: Enhanced Graph Neural Network with 42 features for complex pattern recognition
- **LSTM Model**: Long Short-Term Memory network for sequential data analysis
- **Real-time Monitoring**: Live traffic analysis and threat visualization
- **Dataset**: CTU-13 labeled network traffic dataset (92,214+ samples)

---

## ✨ Features

### Backend (FastAPI)
- ✅ User authentication with JWT tokens
- ✅ Real-time botnet detection predictions
- ✅ Live network monitoring dashboard
- ✅ Sample dataset management
- ✅ Model insights and metrics
- ✅ Email notifications for threats
- ✅ Comprehensive API documentation (Swagger UI)
- ✅ MongoDB database integration

### Frontend (React + Vite)
- ✅ Modern, responsive UI with Tailwind CSS
- ✅ Interactive graphs and visualizations
- ✅ Real-time threat monitoring
- ✅ Authentication system
- ✅ Dataset explorer
- ✅ Model performance metrics
- ✅ Confusion matrix visualization
- ✅ Threat map visualization

---

## 🛠 Technology Stack

### Backend
| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | FastAPI | 0.118.0 |
| Server | Uvicorn | 0.37.0 |
| Database | MongoDB | 4.15.2 |
| ORM | Beanie | 2.0.0 |
| ML Models | PyTorch, TensorFlow | 2.8.0, 3.10.0 |
| ML Libraries | Scikit-learn, NetworkX | 1.6.1, 3.2.1 |
| Auth | Python-Jose, Passlib | 3.5.0, 1.7.4 |

### Frontend
| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | React | 18.3.1 |
| Build Tool | Vite | 5.4.8 |
| Styling | Tailwind CSS | 4.1.17 |
| Routing | React Router | 6.30.1 |
| Visualization | Recharts, React Force Graph | 2.12.7, 1.48.1 |
| Notifications | React Hot Toast | 2.6.0 |

### Database
- **MongoDB** - NoSQL database for user and detection records

---

## 📁 Project Structure

```
botnet_detection/
├── backend/
│   ├── app/
│   │   ├── main.py                 # FastAPI app setup
│   │   ├── config.py               # Configuration settings
│   │   ├── database.py             # MongoDB connection
│   │   │
│   │   ├── routers/
│   │   │   ├── auth.py             # Authentication endpoints
│   │   │   ├── detection.py        # Detection prediction endpoints
│   │   │   ├── live_monitor.py     # Real-time monitoring
│   │   │   └── samples.py          # Sample dataset endpoints
│   │   │
│   │   ├── services/
│   │   │   ├── auth_service.py     # JWT token management
│   │   │   ├── prediction_service.py # ML model predictions
│   │   │   ├── email_service.py    # Email notifications
│   │   │   └── sample_service.py   # Sample data management
│   │   │
│   │   ├── models/
│   │   │   ├── user.py             # User database model
│   │   │   └── detection.py        # Detection record model
│   │   │
│   │   ├── schemas/
│   │   │   ├── auth.py             # Auth request/response schemas
│   │   │   └── detection.py        # Detection schemas
│   │   │
│   │   ├── ml_models/
│   │   │   ├── gcn_architecture.py # GCN model definition
│   │   │   ├── loader.py           # Model loading utilities
│   │   │   └── saved_models/       # Pre-trained models
│   │   │       ├── enhanced_gcn_42feat_best.pth
│   │   │       ├── lstm_final_model.keras
│   │   │       └── *.pkl           # Scalers and feature info
│   │   │
│   │   └── utils/
│   │       └── security.py         # Security utilities
│   │
│   ├── data/
│   │   └── ctu13_combined.csv     # Training dataset (92k+ samples)
│   ├── requirements.txt            # Python dependencies
│   └── test_*.py                   # Test files
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx                 # Main app component
│   │   ├── main.jsx                # Entry point
│   │   ├── styles.css              # Global styles
│   │   │
│   │   ├── components/
│   │   │   ├── Auth.jsx            # Login/Register
│   │   │   ├── Detection.jsx       # Detection interface
│   │   │   ├── LiveMonitoring.jsx  # Real-time monitoring
│   │   │   ├── GnnGraph.jsx        # Graph visualization
│   │   │   ├── ConfusionMatrix.jsx # Metrics visualization
│   │   │   ├── MetricsCards.jsx    # Stats cards
│   │   │   ├── AnimatedStats.jsx   # Animated statistics
│   │   │   └── ThemeToggle.jsx     # Dark mode toggle
│   │   │
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx       # Main dashboard
│   │   │   ├── Login.jsx           # Login page
│   │   │   ├── Register.jsx        # Registration page
│   │   │   ├── Detection.jsx       # Detection results
│   │   │   ├── Metrics.jsx         # Model metrics
│   │   │   ├── ModelInsights.jsx   # Model analysis
│   │   │   ├── DatasetExplorer.jsx # Dataset viewer
│   │   │   ├── ThreatMap.jsx       # Threat visualization
│   │   │   ├── Reports.jsx         # Report generation
│   │   │   ├── Logs.jsx            # Activity logs
│   │   │   ├── Settings.jsx        # User settings
│   │   │   └── Support.jsx         # Help & support
│   │   │
│   │   └── utils/
│   │       └── notify.js           # Toast notifications
│   │
│   ├── package.json                # Node dependencies
│   ├── vite.config.js              # Vite configuration
│   └── index.html                  # HTML entry point
│
├── README.md                       # This file
└── .gitignore                      # Git ignore rules
```

---

## 🚀 Installation & Setup

### Prerequisites
- **Python 3.11+** (for backend)
- **Node.js 20+** (for frontend)
- **MongoDB** (local or cloud)
- **Git**

### Step 1: Clone Repository
```bash
git clone https://github.com/aafil53/Botnet_Detection.git
cd Botnet_Detection
```

### Step 2: Backend Setup

#### 2a. Create Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

#### 2b. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
cd ..
```

#### 2c. Configure Environment Variables
Create a `.env` file in the `backend` directory:
```env
# Database
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=botnet_detection

# JWT
SECRET_KEY=your-secret-key-minimum-32-characters-long
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

# App
DEBUG=True
APP_NAME=Botnet Detection API

# Email (optional)
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_FROM=your-email@gmail.com
```

### Step 3: Frontend Setup

#### 3a. Install Dependencies
```bash
cd frontend
npm install
cd ..
```

#### 3b. Configure API URL
Create `.env.local` in the `frontend` directory:
```env
VITE_API_URL=http://localhost:8000
```

---

## 🏃 Running Locally

### Option 1: Run Both Services (Recommended)

#### Terminal 1 - Start MongoDB
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas (cloud): update MONGODB_URL in .env
```

#### Terminal 2 - Start Backend
```bash
cd backend
venv\Scripts\activate  # Windows: venv\Scripts\activate or Linux: source venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

**Backend running at:** http://localhost:8000

#### Terminal 3 - Start Frontend
```bash
cd frontend
npm run dev
```

**Frontend running at:** http://localhost:5173

### Option 2: Run Individual Services

**Backend Only:**
```bash
cd backend
venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```

**Frontend Only:**
```bash
cd frontend
npm run dev
```

---

## 📚 API Documentation

### Access API Docs
Once backend is running, visit:
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

### Main Endpoints

#### Authentication
```
POST   /auth/register          # Register new user
POST   /auth/login             # Login (returns JWT token)
POST   /auth/logout            # Logout
GET    /auth/me                # Get current user
```

#### Detection
```
POST   /detection/predict      # Make prediction on traffic sample
GET    /detection/history      # Get detection history
GET    /detection/{id}         # Get specific detection
```

#### Samples
```
GET    /samples/               # List all samples
GET    /samples/{id}           # Get sample details
POST   /samples/upload         # Upload new sample
```

#### Live Monitoring
```
WebSocket /live-monitor/stream # Real-time monitoring stream
GET    /live-monitor/status    # Get monitoring status
```

#### Health
```
GET    /health                 # Health check
GET    /                       # API info
```

---

## 🌐 Deployment Guide

### Option 1: Vercel + Render + MongoDB Atlas (Recommended)

#### Step 1: Deploy Frontend on Vercel
1. Push code to GitHub
2. Go to https://vercel.com
3. Click "New Project" → Select "Botnet_Detection"
4. Set environment variable: `VITE_API_URL=your-render-backend-url`
5. Deploy

**Frontend URL:** `https://your-project.vercel.app`

#### Step 2: Deploy Backend on Render
1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect GitHub repository
4. Set environment variables:
   - `MONGODB_URL=your-mongodb-atlas-url`
   - `SECRET_KEY=your-secret-key`
   - `DEBUG=false`
5. Deploy

**Backend URL:** `https://your-api.onrender.com`

#### Step 3: Setup MongoDB Atlas
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster (512MB storage)
3. Get connection string
4. Add to environment variables

### Option 2: Docker (Local or VPS)

Build and run with Docker:
```bash
docker-compose up --build
```

Access at:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- MongoDB: localhost:27017

---

## 💻 Usage Guide

### 1. Register & Login
- Visit frontend URL
- Create account
- Login with credentials

### 2. Make Detection
- Go to "Detection" page
- Upload network traffic sample (CSV format with 42 features)
- Get prediction: Normal (0) or Botnet (1)
- View confidence score and model analysis

### 3. Monitor Live Traffic
- Go to "Live Monitoring" page
- View real-time threat alerts
- See threat distribution graph
- Monitor suspicious IPs

### 4. View Metrics
- Go to "Metrics" page
- See model performance:
  - Accuracy
  - Precision
  - Recall
  - F1 Score
  - Confusion Matrix
- Compare GCN vs LSTM models

### 5. Explore Dataset
- Go to "Dataset Explorer"
- Browse CTU-13 samples
- Filter by label (Normal/Botnet)
- View statistics

---

## 🧠 ML Models

### GCN (Graph Convolutional Network)
- **Architecture:** Enhanced GCN with 42 features
- **Purpose:** Capture network graph patterns
- **File:** `enhanced_gcn_42feat_best.pth`
- **Input:** Network flow features
- **Output:** Probability of botnet activity

### LSTM (Long Short-Term Memory)
- **Architecture:** Sequential LSTM layers
- **Purpose:** Analyze temporal patterns
- **File:** `lstm_final_model.keras`
- **Input:** Time-series network features
- **Output:** Probability of botnet activity

### Feature Set (42 features)
Network flow statistics including:
- Flow duration and packet counts
- Packet lengths and rates
- Inter-arrival times
- TCP flags
- Payload information
- Statistical measures (mean, std, min, max)

---

## 🔐 Security Features

- **JWT Authentication:** Secure token-based auth
- **Password Hashing:** Bcrypt encryption
- **CORS Protection:** Cross-origin request handling
- **Input Validation:** Pydantic schemas
- **Rate Limiting:** Coming soon
- **Email Verification:** Optional
- **Threat Alerts:** Real-time notifications

---

## 📊 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  username: String,
  email: String,
  hashed_password: String,
  is_active: Boolean,
  created_at: DateTime,
  updated_at: DateTime
}
```

### Detections Collection
```javascript
{
  _id: ObjectId,
  user_id: ObjectId,
  input_features: Array,
  gcn_prediction: Number (0 or 1),
  lstm_prediction: Number (0 or 1),
  gcn_confidence: Float,
  lstm_confidence: Float,
  final_prediction: Number,
  timestamp: DateTime,
  source_ip: String (optional),
  destination_ip: String (optional)
}
```

---

## 🧪 Testing

Run tests:
```bash
cd backend
pytest test_auth.py       # Auth tests
pytest test_detection.py  # Detection tests
pytest test_mail.py       # Email tests
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| MongoDB connection error | Check MONGODB_URL in .env, ensure MongoDB is running |
| Frontend can't reach backend | Verify VITE_API_URL is correct, check CORS settings |
| ML model not loading | Ensure saved_models directory has all .pth/.keras files |
| Port already in use | Change port: `uvicorn app.main:app --port 8001` |
| NPM modules error | Delete node_modules and `npm install` again |

---

## 📈 Performance & Scalability

**Current Performance:**
- GCN Model: ~95ms inference time
- LSTM Model: ~87ms inference time
- API Response: <200ms
- Database Queries: <50ms

**Optimization Tips:**
- Use MongoDB Atlas for better performance
- Enable caching for repeated predictions
- Use CDN for frontend assets
- Implement rate limiting for production

---

## 📝 API Examples

### Register User
```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "user123",
    "email": "user@example.com",
    "password": "securepass123"
  }'
```

### Login
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "user123",
    "password": "securepass123"
  }'
```

### Make Prediction
```bash
curl -X POST http://localhost:8000/detection/predict \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "features": [value1, value2, ... value42]
  }'
```

---

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push and create a pull request

---

## 📜 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 👨‍💻 Author

- **Aafil** - aafil53
- GitHub: https://github.com/aafil53

---

## 📞 Support

For issues, questions, or suggestions:
- Create a GitHub Issue
- Email: your-email@example.com
- Visit Support page in the application

---

## 🙏 Acknowledgments

- **Dataset:** CTU-13 labeled network traffic dataset
- **Models:** PyTorch, TensorFlow communities
- **Frontend:** React and Vite communities
- **Deployment:** Vercel, Render, MongoDB Atlas

---

**Last Updated:** November 25, 2025
**Version:** 1.0.0