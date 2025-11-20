import React, { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { FaHome, FaShieldAlt, FaChartLine, FaList, FaCog, FaQuestionCircle, FaBrain, FaSignOutAlt } from 'react-icons/fa';
import Detection from './components/Detection.jsx';
import LiveMonitoring from './components/LiveMonitoring.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import DatasetExplorer from './pages/DatasetExplorer.jsx';
import ModelInsights from './pages/ModelInsights.jsx';
import Logs from './pages/Logs.jsx';
import Settings from './pages/Settings.jsx';
import Support from './pages/Support.jsx';
import ProfileDropdown from './components/ProfileDropdown.jsx';
import ThemeToggle from './components/ThemeToggle.jsx';
import Metrics from './pages/Metrics.jsx';
import Reports from './pages/Reports.jsx';

const API_URL = 'http://127.0.0.1:8000';

export default function App() {
	const [token, setToken] = useState(localStorage.getItem('token'));
	const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail'));
	const [isDark, setIsDark] = useState(localStorage.getItem('theme') !== 'light');
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		if (token) {
			localStorage.setItem('token', token);
		} else {
			localStorage.removeItem('token');
		}
	}, [token]);

	useEffect(() => {
		if (userEmail) {
			localStorage.setItem('userEmail', userEmail);
		} else {
			localStorage.removeItem('userEmail');
		}
	}, [userEmail]);

	useEffect(() => {
		document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
		localStorage.setItem('theme', isDark ? 'dark' : 'light');
	}, [isDark]);

	const api = useMemo(
		() => ({
			login: async (email, password) => {
				const formData = new FormData();
				formData.append('username', email);
				formData.append('password', password);
				const res = await fetch(`${API_URL}/auth/login`, {
					method: 'POST',
					body: formData
				});
				if (!res.ok) {
					const err = await res.json().catch(() => ({}));
					throw new Error(err.detail || 'Login failed');
				}
				const data = await res.json();
				return data;
			},
			register: async (payload) => {
				const res = await fetch(`${API_URL}/auth/register`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(payload)
				});
				if (!res.ok) {
					const err = await res.json().catch(() => ({}));
					throw new Error(err.detail || 'Registration failed');
				}
				return res.json();
			},
			runBatchDetection: async (authToken, payload) => {
				const res = await fetch(`${API_URL}/detect/batch`, {
					method: 'POST',
					headers: {
						Authorization: `Bearer ${authToken}`,
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(payload)
				});
				if (!res.ok) {
					const err = await res.json().catch(() => ({}));
					throw new Error(err.detail || 'Detection failed');
				}
				return res.json();
			},
			startMonitoring: async (authToken, params) => {
				if (!authToken) {
					throw new Error('Authentication token is required. Please log in again.');
				}
				const { duration, interval, alertThreshold } = params;
				const url = `${API_URL}/monitor/start?duration=${duration}&interval=${interval}&alert_threshold=${alertThreshold}`;
				const res = await fetch(url, {
					method: 'POST',
					headers: {
						Authorization: `Bearer ${authToken}`,
						'Content-Type': 'application/json'
					}
				});
				if (!res.ok) {
					const err = await res.json().catch(() => ({}));
					if (res.status === 401) {
						throw new Error('Session expired. Please log in again.');
					}
					throw new Error(err.detail || 'Monitoring failed');
				}
				return res.json();
			},
			streamPacket: async (authToken) => {
				const res = await fetch(`${API_URL}/monitor/stream`, {
					headers: {
						Authorization: `Bearer ${authToken}`
					}
				});
				if (!res.ok) {
					throw new Error('Stream request failed');
				}
				return res.json();
			},
			getDatasetInfo: async (authToken) => {
				const res = await fetch(`${API_URL}/samples/info`, {
					headers: {
						Authorization: `Bearer ${authToken}`
					}
				});
				if (!res.ok) {
					const err = await res.json().catch(() => ({}));
					throw new Error(err.detail || 'Failed to fetch dataset info');
				}
				return res.json();
			},
			getRandomSamples: async (authToken, n = 20, balanced = true) => {
				const res = await fetch(`${API_URL}/samples/random?n=${n}&balanced=${balanced}`, {
					headers: {
						Authorization: `Bearer ${authToken}`
					}
				});
				if (!res.ok) {
					const err = await res.json().catch(() => ({}));
					throw new Error(err.detail || 'Failed to fetch samples');
				}
				return res.json();
			}
		}),
		[]
	);

	const handleLogout = () => {
		setToken(null);
		setUserEmail(null);
		navigate('/login');
	};

	const handleSettings = () => {
		navigate('/settings');
	};

	const isActive = (path) => location.pathname === path;

	return (
		<div className="app">
			<Toaster
				position="top-right"
				toastOptions={{
					duration: 3000,
					style: {
						background: isDark ? 'rgba(30, 30, 46, 0.95)' : '#ffffff',
						color: isDark ? '#ffffff' : '#1f2937',
						border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`
					}
				}}
			/>
			<div className="container">
				<header className="header">
					<div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center' }}>
						<img src="/logo.svg" alt="Botnet Detection" style={{ width: 40, height: 40, borderRadius: 8 }} />
						<h1 style={{ margin: 0 }}>Botnet Detection System</h1>
					</div>
					<p>AI-Powered Network Security Analysis</p>
				</header>

				<nav className="navbar">
					<div className="nav-links">
						{token ? (
							<>
								<Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
									<FaHome /> Dashboard
								</Link>
								<Link to="/detect" className={`nav-link ${isActive('/detect') ? 'active' : ''}`}>
									<FaShieldAlt /> Detection
								</Link>
								<Link to="/monitor" className={`nav-link ${isActive('/monitor') ? 'active' : ''}`}>
									<FaChartLine /> Live Monitor
								</Link>
								<Link to="/dataset" className={`nav-link ${isActive('/dataset') ? 'active' : ''}`}>
									<FaBrain /> Dataset Explorer
								</Link>
								<Link to="/insights" className={`nav-link ${isActive('/insights') ? 'active' : ''}`}>
									<FaChartLine /> Model Insights
								</Link>
								<Link to="/metrics" className={`nav-link ${isActive('/metrics') ? 'active' : ''}`}>
									<FaChartLine /> Metrics
								</Link>
								<Link to="/logs" className={`nav-link ${isActive('/logs') ? 'active' : ''}`}>
									<FaList /> Logs
								</Link>
								<Link to="/reports" className={`nav-link ${isActive('/reports') ? 'active' : ''}`}>
									<FaChartLine /> Reports
								</Link>
								<Link to="/support" className={`nav-link ${isActive('/support') ? 'active' : ''}`}>
									<FaQuestionCircle /> Support
								</Link>
								{token && (
									<>
										<ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
										<ProfileDropdown userEmail={userEmail} onLogout={handleLogout} onSettings={handleSettings} />
										<button 
											className="btn danger" 
											onClick={handleLogout}
											style={{ 
												marginLeft: '8px',
												padding: '10px 16px',
												fontSize: '0.9rem',
												display: 'inline-flex',
												alignItems: 'center',
												gap: '8px'
											}}
										>
											<FaSignOutAlt />
											Logout
										</button>
									</>
								)}
							</>
						) : (
							<>
								<Link to="/login" className={`nav-link ${isActive('/login') ? 'active' : ''}`}>
									Login
								</Link>
								<Link to="/register" className={`nav-link ${isActive('/register') ? 'active' : ''}`}>
									Register
								</Link>
							</>
						)}
					</div>
				</nav>

				<Routes>
					<Route
						path="/"
						element={token ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
					/>
					<Route
						path="/login"
						element={
							token ? (
								<Navigate to="/dashboard" replace />
							) : (
								<Login
									api={api}
									onSuccess={(email, accessToken) => {
										setUserEmail(email);
										setToken(accessToken);
										navigate('/dashboard');
									}}
								/>
							)
						}
					/>
					<Route
						path="/register"
						element={
							token ? (
								<Navigate to="/dashboard" replace />
							) : (
								<Register
									api={api}
									onSuccess={() => navigate('/login')}
								/>
							)
						}
					/>
					<Route
						path="/dashboard"
						element={token ? <Dashboard token={token} api={api} /> : <Navigate to="/login" replace />}
					/>
					<Route
						path="/detect"
						element={token ? <Detection token={token} api={api} /> : <Navigate to="/login" replace />}
					/>
					<Route
						path="/monitor"
						element={
							token ? (
								<LiveMonitoring token={token} userEmail={userEmail} api={api} />
							) : (
								<Navigate to="/login" replace />
							)
						}
					/>
					<Route
						path="/dataset"
						element={token ? <DatasetExplorer token={token} api={api} /> : <Navigate to="/login" replace />}
					/>
					<Route
						path="/insights"
						element={token ? <ModelInsights /> : <Navigate to="/login" replace />}
					/>
					<Route
						path="/metrics"
						element={token ? <Metrics /> : <Navigate to="/login" replace />}
					/>
					<Route
						path="/logs"
						element={token ? <Logs /> : <Navigate to="/login" replace />}
					/>
					<Route
						path="/reports"
						element={token ? <Reports /> : <Navigate to="/login" replace />}
					/>
					<Route
						path="/settings"
						element={token ? <Settings userEmail={userEmail} onLogout={handleLogout} /> : <Navigate to="/login" replace />}
					/>
					<Route
						path="/support"
						element={token ? <Support /> : <Navigate to="/login" replace />}
					/>
				</Routes>
			</div>
		</div>
	);
}
