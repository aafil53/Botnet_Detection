import React from 'react';
import { FaMapMarkedAlt, FaExclamationTriangle } from 'react-icons/fa';

export default function ThreatMap() {
	return (
		<div className="page-container">
			<h2 className="page-title">Threat Map</h2>
			<p className="page-subtitle">Visualize attack sources worldwide</p>

			<div className="card">
				<div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(255,255,255,0.6)' }}>
					<FaMapMarkedAlt style={{ fontSize: '4rem', marginBottom: '16px', opacity: 0.3 }} />
					<p>Threat map visualization coming soon...</p>
					<p style={{ fontSize: '0.9rem', marginTop: '8px' }}>
						World map highlighting attack sources and botnet origins
					</p>
					<div style={{ marginTop: '24px', padding: '16px', background: 'rgba(255,107,107,0.1)', borderRadius: '10px', display: 'inline-block' }}>
						<FaExclamationTriangle style={{ marginRight: '8px' }} />
						Integration with react-simple-maps or Leaflet planned
					</div>
				</div>
			</div>
		</div>
	);
}

