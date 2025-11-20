import React, { useMemo } from 'react';
import MetricsCards from '../components/MetricsCards.jsx';
import ConfusionMatrix from '../components/ConfusionMatrix.jsx';
import {
	ResponsiveContainer,
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend
} from 'recharts';

export default function Metrics() {
	let last = null;
	try {
		last = JSON.parse(localStorage.getItem('lastDetection') || 'null');
	} catch {
		last = null;
	}

	const labelsAvailable = useMemo(() => {
		return Boolean(
			last?.predictions?.length &&
				last.predictions.some(
					(p) => p.actual_label !== null && p.actual_label !== undefined
				)
		);
	}, [last]);

	const metrics = useMemo(() => {
		if (!last) return {};
		if (!labelsAvailable) {
			return {
				accuracy:
					last?.summary?.accuracy !== null && last?.summary?.accuracy !== undefined
						? last.summary.accuracy / 100
						: null
			};
		}
		let tp = 0,
			tn = 0,
			fp = 0,
			fn = 0;
		for (const p of last.predictions) {
			if (p.actual_label === null || p.actual_label === undefined) continue;
			if (p.actual_label === 1 && p.prediction === 1) tp++;
			else if (p.actual_label === 0 && p.prediction === 0) tn++;
			else if (p.actual_label === 0 && p.prediction === 1) fp++;
			else if (p.actual_label === 1 && p.prediction === 0) fn++;
		}
		const total = tp + tn + fp + fn;
		const accuracy = total ? (tp + tn) / total : null;
		const precision = tp + fp ? tp / (tp + fp) : null;
		const recall = tp + fn ? tp / (tp + fn) : null;
		const f1 =
			precision && recall && precision + recall
				? (2 * precision * recall) / (precision + recall)
				: null;
		return { accuracy, precision, recall, f1, matrix: [[tn, fp], [fn, tp]] };
	}, [last, labelsAvailable]);

	const chartData = useMemo(() => {
		if (!last?.predictions) return [];
		return last.predictions.map((p, i) => ({
			name: `S${i + 1}`,
			probability: +(p.probability * 100).toFixed(2),
			confidence: +(p.confidence * 100).toFixed(2)
		}));
	}, [last]);

	if (!last) {
		return (
			<div className="card">
				<h2>Metrics</h2>
				<p className="muted">No recent results found. Run a detection first.</p>
			</div>
		);
	}

	return (
		<div className="card">
			<h2>Metrics</h2>
			<p className="muted small">Based on your most recent detection run</p>
			<div style={{ marginTop: 12 }}>
				<MetricsCards metrics={metrics} />
			</div>
			{labelsAvailable ? <ConfusionMatrix matrix={metrics.matrix} /> : null}
			<div className="chart-card">
				<h3 style={{ marginBottom: 12 }}>Prediction Probabilities & Confidence</h3>
				<div style={{ width: '100%', height: 280 }}>
					<ResponsiveContainer>
						<LineChart data={chartData}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="name" />
							<YAxis domain={[0, 100]} unit="%" />
							<Tooltip />
							<Legend />
							<Line
								type="monotone"
								dataKey="probability"
								stroke="#667eea"
								activeDot={{ r: 6 }}
							/>
							<Line type="monotone" dataKey="confidence" stroke="#764ba2" />
						</LineChart>
					</ResponsiveContainer>
				</div>
			</div>
		</div>
	);
}

