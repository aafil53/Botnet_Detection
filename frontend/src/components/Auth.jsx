import React, { useState } from 'react';

export default function Auth({ onLoginSuccess, api }) {
	const [email, setEmail] = useState('testuser@example.com');
	const [password, setPassword] = useState('testpass123');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		if (!email || !password) {
			setError('Please enter email and password');
			return;
		}
		setLoading(true);
		try {
			const data = await api.login(email, password);
			if (data.access_token) {
				onLoginSuccess(email, data.access_token);
			} else {
				setError('Invalid response from server');
			}
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="card">
			<h2>Login</h2>
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label>Email</label>
					<input
						type="email"
						placeholder="Enter your email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>
				<div className="form-group">
					<label>Password</label>
					<input
						type="password"
						placeholder="Enter your password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>
				<button className="btn primary" type="submit" disabled={loading}>
					{loading ? '⏳ Logging in...' : 'Login'}
				</button>
				<p className="muted small" style={{ marginTop: 12 }}>
					Demo credentials: testuser@example.com / testpass123
				</p>
				{error ? (
					<p className="error" role="alert" style={{ marginTop: 8 }}>
						{error}
					</p>
				) : null}
			</form>
		</div>
	);
}

