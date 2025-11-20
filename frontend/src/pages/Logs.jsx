import React, { useState, useEffect } from 'react';
import { FaList, FaSearch, FaFilter } from 'react-icons/fa';

export default function Logs() {
	const [logs, setLogs] = useState([]);

	useEffect(() => {
		// Load logs from localStorage
		const lastResults = localStorage.getItem('lastDetectionResults');
		if (lastResults) {
			try {
				const data = JSON.parse(lastResults);
				const predictions = data.predictions || [];
				setLogs(
					predictions.map((p, idx) => ({
						id: idx + 1,
						timestamp: new Date().toISOString(),
						prediction: p.prediction_label,
						confidence: (p.confidence * 100).toFixed(2),
						probability: (p.probability * 100).toFixed(2)
					}))
				);
			} catch (e) {
				console.error('Error loading logs:', e);
			}
		}
	}, []);

	return (
		<div className="page-container">
			<h2 className="page-title">Detection Logs</h2>
			<p className="page-subtitle">View all past detections and results</p>

			<div className="card">
				<div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
					<div style={{ flex: 1, position: 'relative' }}>
						<FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
						<input
							type="text"
							placeholder="Search logs..."
							style={{
								width: '100%',
								padding: '12px 12px 12px 40px',
								border: '2px solid rgba(255,255,255,0.1)',
								borderRadius: '10px',
								background: 'rgba(255,255,255,0.05)',
								color: '#ffffff'
							}}
						/>
					</div>
					<button className="btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
						<FaFilter /> Filter
					</button>
				</div>

				{logs.length > 0 ? (
					<div style={{ overflowX: 'auto' }}>
						<table style={{ width: '100%', borderCollapse: 'collapse' }}>
							<thead>
								<tr style={{ borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
									<th style={{ padding: '12px', textAlign: 'left', color: 'rgba(255,255,255,0.7)' }}>ID</th>
									<th style={{ padding: '12px', textAlign: 'left', color: 'rgba(255,255,255,0.7)' }}>Timestamp</th>
									<th style={{ padding: '12px', textAlign: 'left', color: 'rgba(255,255,255,0.7)' }}>Prediction</th>
									<th style={{ padding: '12px', textAlign: 'left', color: 'rgba(255,255,255,0.7)' }}>Confidence</th>
									<th style={{ padding: '12px', textAlign: 'left', color: 'rgba(255,255,255,0.7)' }}>Probability</th>
								</tr>
							</thead>
							<tbody>
								{logs.map((log) => (
									<tr key={log.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
										<td style={{ padding: '12px' }}>{log.id}</td>
										<td style={{ padding: '12px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>
											{new Date(log.timestamp).toLocaleString()}
										</td>
										<td style={{ padding: '12px' }}>
											<span
												className="badge"
												style={{
													background: log.prediction === 'Botnet' ? '#FF6B6B' : '#4ECDC4',
													padding: '4px 12px',
													borderRadius: '12px',
													fontSize: '0.85rem'
												}}
											>
												{log.prediction}
											</span>
										</td>
										<td style={{ padding: '12px' }}>{log.confidence}%</td>
										<td style={{ padding: '12px' }}>{log.probability}%</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				) : (
					<div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(255,255,255,0.6)' }}>
						<FaList style={{ fontSize: '4rem', marginBottom: '16px', opacity: 0.3 }} />
						<p>No logs available yet</p>
						<p style={{ fontSize: '0.9rem', marginTop: '8px' }}>Run a detection to see logs here</p>
					</div>
				)}
			</div>
		</div>
	);
}

