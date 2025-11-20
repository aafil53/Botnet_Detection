import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function AuthTabs() {
	const { pathname } = useLocation();
	const isLogin = pathname === '/login';
	return (
		<div className="actions" style={{ justifyContent: 'center', marginBottom: 12 }}>
			<Link
				to="/login"
				className="btn"
				style={{
					background: isLogin
						? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
						: '#f3f4f6',
					color: isLogin ? '#ffffff' : '#111827'
				}}
			>
				Login
			</Link>
			<Link
				to="/register"
				className="btn"
				style={{
					background: !isLogin
						? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
						: '#f3f4f6',
					color: !isLogin ? '#ffffff' : '#111827'
				}}
			>
				Register
			</Link>
		</div>
	);
}

