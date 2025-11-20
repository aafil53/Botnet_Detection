import React from 'react';

export default function StatsGrid({ items }) {
	return (
		<div className="stats-grid">
			{items.map((it) => (
				<div className="stat-card" key={it.label}>
					<h3>{it.value}</h3>
					<p>{it.label}</p>
				</div>
			))}
		</div>
	);
}

