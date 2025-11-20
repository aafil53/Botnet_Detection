import React, { useEffect, useState } from 'react';
import { FaCog, FaKey, FaBell, FaPalette, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { ensureNotificationPermission, notificationsEnabled, setNotificationsEnabled } from '../utils/notify.js';

export default function Settings({ userEmail, onLogout }) {
	const [notifEnabled, setNotifEnabled] = useState(notificationsEnabled());

	useEffect(() => {
		setNotificationsEnabled(notifEnabled);
		if (notifEnabled) ensureNotificationPermission();
	}, [notifEnabled]);

	return (
		<div className="page-container">
			<h2 className="page-title">Settings</h2>
			<p className="page-subtitle">Configure your preferences and API keys</p>

			<div className="grid-2">
				<div className="card" style={{ border: '2px solid var(--danger)', borderColor: 'rgba(231, 76, 60, 0.3)' }}>
					<h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
						<FaUser /> Account
					</h3>
					<div className="form-group">
						<label>Email</label>
						<input type="email" value={userEmail || ''} className="input" disabled />
					</div>
					<button 
						className="btn danger" 
						onClick={onLogout || (() => console.error('onLogout is not defined'))} 
						style={{ 
							marginTop: '20px',
							width: '100%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							gap: '8px',
							fontSize: '1rem',
							padding: '14px 20px',
							fontWeight: '600'
						}}
					>
						<FaSignOutAlt />
						Logout
					</button>
				</div>

				<div className="card">
					<h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
						<FaKey /> API Configuration
					</h3>
					<div className="form-group">
						<label>API Key</label>
						<input type="password" placeholder="Enter API key..." className="input" />
					</div>
					<button className="btn primary">Save API Key</button>
				</div>

				<div className="card">
					<h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
						<FaBell /> Notifications
					</h3>
					<div className="form-group">
						<label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
							<input
								type="checkbox"
								checked={notifEnabled}
								onChange={(e) => setNotifEnabled(e.target.checked)}
								style={{ width: 18, height: 18 }}
							/>
							Enable browser notifications
						</label>
					</div>
					<div className="form-group">
						<label>
							<input type="checkbox" style={{ marginRight: '8px' }} />
							Email alerts for threats
						</label>
					</div>
					<div className="form-group">
						<label>
							<input type="checkbox" style={{ marginRight: '8px' }} />
							Desktop notifications
						</label>
					</div>
					<button className="btn primary">Save Preferences</button>
				</div>

				<div className="card">
					<h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
						<FaPalette /> Appearance
					</h3>
					<div className="form-group">
						<label>Theme</label>
						<select className="input">
							<option>Dark (Cyber Glow)</option>
							<option>Light</option>
							<option>Auto</option>
						</select>
					</div>
					<button className="btn primary">Save Theme</button>
				</div>

				<div className="card">
					<h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
						<FaCog /> General
					</h3>
					<div className="form-group">
						<label>Auto-refresh interval (seconds)</label>
						<input type="number" defaultValue={30} className="input" />
					</div>
					<button className="btn primary">Save Settings</button>
				</div>
			</div>
		</div>
	);
}

