import React from 'react';
import StatsGrid from './StatsGrid.jsx';

export default function MetricsCards({ metrics }) {
	const items = [
		{ label: 'Accuracy', value: metrics.accuracy ?? 'N/A' },
		{ label: 'Precision', value: metrics.precision ?? 'N/A' },
		{ label: 'Recall', value: metrics.recall ?? 'N/A' },
		{ label: 'F1 Score', value: metrics.f1 ?? 'N/A' }
	].map((it) => ({
		label: it.label,
		value:
			typeof it.value === 'number'
				? `${(it.value * 100).toFixed(1)}%`
				: it.value
	}));
	return <StatsGrid items={items} />;
}

