import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthTabs from '../components/AuthTabs.jsx';

export default function Login({ api, onSuccess }) {
	const [email, setEmail] = useState('mdaafil55@gmail.com');
	const [password, setPassword] = useState('Aafil@2004');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const canSubmit = useMemo(
		() => /\S+@\S+\.\S+/.test(email) && password.length >= 6,
		[email, password]
	);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		if (!canSubmit) {
			toast.error('Enter a valid email and password (min 6 chars)');
			return;
		}
		setLoading(true);
		try {
			const data = await api.login(email, password);
			if (data.access_token) {
				toast.success('Login successful!');
				onSuccess(email, data.access_token);
			} else {
				toast.error('Invalid response from server');
			}
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
					<div className="auth-hero-orb" />
					<span className="auth-pill">Botnet Lab Console</span>
					<h1>Measure detection methods in a realistic sandbox.</h1>
					<p>
						This portal supports the college research project on botnet detection. Launch dataset
						replays, inspect telemetry, and record observations in a controlled, reproducible
						environment.
					</p>
					<div className="auth-stat-grid">
						<div className="auth-stat">
							<p className="stat-label">Recent Experiment Accuracy</p>
							<p className="stat-value">92.1%</p>
							<span>simulated dataset, 48h window</span>
						</div>
						<div className="auth-stat">
							<p className="stat-label">Model variants tracked</p>
							<p className="stat-value">12</p>
							<span>LSTM • GNN • ensembles</span>
						</div>
					</div>
					<ul className="auth-feature-list">
						<li>Structured labs for traffic replay & labeling exercises</li>
						<li>Versioned test plans for reproducible academic results</li>
						<li>Export-ready summaries for reports and presentations</li>
					</ul>
				</section>

				<section className="auth-card">
					<AuthTabs />
					<h2>Welcome back</h2>
					<p className="auth-card-subtitle">
						Access your lab workspace to run detection batches, review telemetry, and submit findings
						for assessment.
					</p>
					<div className="auth-divider" />
					<form onSubmit={handleSubmit} className="auth-form-modern">
						<div className="form-group">
							<label>Email</label>
							<input
								type="email"
								placeholder="you@securityhq.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								autoComplete="email"
								required
							/>
						</div>
						<div className="form-group">
							<label>Password</label>
							<div className="input-with-button">
								<input
									type={showPassword ? 'text' : 'password'}
									placeholder="••••••••••"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									autoComplete="current-password"
									required
								/>
								<button
									type="button"
									className="btn subtle"
									onClick={() => setShowPassword((v) => !v)}
									aria-label="Toggle password visibility"
								>
									{showPassword ? 'Hide' : 'Show'}
								</button>
							</div>
							<p className="muted small">Use at least 6 characters including numbers.</p>
						</div>
						<button className="btn primary w-full" type="submit" disabled={loading || !canSubmit}>
							{loading ? <span className="spinner" aria-hidden /> : '🔐'}
							{loading ? 'Securing session…' : 'Sign in securely'}
						</button>
						<p className="muted small auth-footer-text">
							Don’t have an account? <Link to="/register">Request access</Link>
						</p>
						{error ? (
							<p className="error" role="alert" style={{ marginTop: 8 }}>
								{error}
							</p>
						) : null}
					</form>
				</section>
			</div>
		</div>
	);
}

