import React from 'react';
import { FaBook, FaQuestionCircle, FaEnvelope, FaGithub } from 'react-icons/fa';

export default function Support() {
	return (
		<div className="page-container">
			<h2 className="page-title">Support & Documentation</h2>
			<p className="page-subtitle">Get help and learn about the system</p>

			<div className="grid-2">
				<div className="card">
					<h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
						<FaBook /> Documentation
					</h3>
					<ul style={{ listStyle: 'none', padding: 0 }}>
						<li style={{ padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
							<a href="#" style={{ color: '#00E5FF', textDecoration: 'none' }}>Model Explanations</a>
						</li>
						<li style={{ padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
							<a href="#" style={{ color: '#00E5FF', textDecoration: 'none' }}>Dataset Sources</a>
						</li>
						<li style={{ padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
							<a href="#" style={{ color: '#00E5FF', textDecoration: 'none' }}>API Reference</a>
						</li>
						<li style={{ padding: '12px 0' }}>
							<a href="#" style={{ color: '#00E5FF', textDecoration: 'none' }}>Getting Started Guide</a>
						</li>
					</ul>
				</div>

				<div className="card">
					<h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
						<FaQuestionCircle /> Help & Support
					</h3>
					<div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
						<a href="mailto:support@botnet-detection.com" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#00E5FF', textDecoration: 'none' }}>
							<FaEnvelope /> support@botnet-detection.com
						</a>
						<a href="https://github.com" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#00E5FF', textDecoration: 'none' }}>
							<FaGithub /> GitHub Repository
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}

