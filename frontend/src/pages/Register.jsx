import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthTabs from '../components/AuthTabs.jsx';

export default function Register({ api, onSuccess }) {
	const [email, setEmail] = useState('secops.lead@secure.ai');
	const [username, setUsername] = useState('secops-lead');
	const [password, setPassword] = useState('SecureOps#2040');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [done, setDone] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const passwordScore = useMemo(() => {
		let score = 0;
		if (password.length >= 6) score++;
		if (/[A-Z]/.test(password)) score++;
		if (/[0-9]/.test(password)) score++;
		if (/[^A-Za-z0-9]/.test(password)) score++;
		return score; // 0-4
	}, [password]);
	const canSubmit = useMemo(
		() =>
			/\S+@\S+\.\S+/.test(email) &&
			username.trim().length >= 3 &&
			password.length >= 6,
		[email, username, password]
	);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setDone(false);
		if (!canSubmit) {
			toast.error('Provide a valid email, username (≥3), and password (≥6)');
			return;
		}
		setLoading(true);
		try {
			await api.register({ email, username, password });
			setDone(true);
			toast.success('Account created successfully! Redirecting to login...');
			setTimeout(() => onSuccess(), 1500);
		} catch (err) {
			toast.error(err.message);
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="auth-shell">
			<div className="auth-layout">
				<section className="auth-hero">
					<div className="auth-hero-orb alt" />
					<span className="auth-pill">Research Project Portal</span>
					<h1>Explore botnet detection insights and model performance.</h1>
					<p>
						Access the research environment to analyze network traffic patterns, evaluate detection models,
						and gain insights into botnet behavior. This portal supports academic research on network security.
					</p>
					<div className="auth-stat-grid">
						<div className="auth-stat">
							<p className="stat-label">Detection models</p>
							<p className="stat-value">3</p>
							<span>LSTM • GNN • Ensemble</span>
						</div>
						<div className="auth-stat">
							<p className="stat-label">Traffic datasets</p>
							<p className="stat-value">6</p>
							<span>curated network captures</span>
						</div>
					</div>
					<ul className="auth-feature-list">
						<li>Real-time model performance metrics and accuracy analysis</li>
						<li>Graph-based visualization of network relationships and botnet patterns</li>
						<li>Comprehensive detection results with confusion matrices and F1 scores</li>
					</ul>
				</section>

				<section className="auth-card">
					<AuthTabs />
					<h2>Create secure workspace access</h2>
					<p className="auth-card-subtitle">
						Provision a new user for the laboratory environment so they can run detection batches,
						monitor traffic, and contribute results.
					</p>
					<div className="auth-divider" />
					<form onSubmit={handleSubmit} className="auth-form-modern">
						<div className="form-group">
							<label>Email</label>
							<input
								type="email"
								placeholder="teamlead@secure.ai"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								autoComplete="email"
								required
							/>
						</div>
						<div className="form-group">
							<label>Username</label>
							<input
								type="text"
								placeholder="Choose a username"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								autoComplete="username"
								required
							/>
							<p className="muted small">Minimum 3 characters, lowercase recommended.</p>
						</div>
						<div className="form-group">
							<label>Password</label>
							<div className="input-with-button">
								<input
									type={showPassword ? 'text' : 'password'}
									placeholder="Create a strong password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									autoComplete="new-password"
									required
								/>
								<button
									type="button"
									className="btn subtle"
									onClick={() => setShowPassword((v) => !v)}
								>
									{showPassword ? 'Hide' : 'Show'}
								</button>
							</div>
							<div className="auth-strength">
								<div className="progress-bar compact">
									<div
										className="progress-fill"
										style={{ width: `${(passwordScore / 4) * 100}%` }}
									/>
								</div>
								<span className="muted small">Mix upper/lowercase, numbers & symbols.</span>
							</div>
						</div>
						<button className="btn primary w-full" type="submit" disabled={loading || !canSubmit}>
							{loading ? <span className="spinner" aria-hidden /> : '🚀'}
							{loading ? 'Provisioning access…' : 'Create secure account'}
						</button>
						<p className="muted small auth-footer-text">
							Already inside? <Link to="/login">Go to login</Link>
						</p>
						{error ? (
							<p className="error" role="alert" style={{ marginTop: 8 }}>
								{error}
							</p>
						) : null}
						{done ? (
							<p className="muted small" style={{ marginTop: 8 }}>
								Account created. Redirecting to login…
							</p>
						) : null}
					</form>
				</section>
			</div>
		</div>
	);
}

