import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaBrain, FaChartBar } from 'react-icons/fa';

export default function ModelInsights() {
	const modelData = [
		{ model: 'LSTM', accuracy: 94.2, precision: 92.8, recall: 95.1, f1: 93.9 },
		{ model: 'GNN', accuracy: 96.5, precision: 95.2, recall: 97.1, f1: 96.1 },
		{ model: 'Ensemble', accuracy: 98.1, precision: 97.5, recall: 98.3, f1: 97.9 }
	];

	return (
		<div className="page-container">
			<h2 className="page-title">Model Insights</h2>
			<p className="page-subtitle">Compare performance metrics across models</p>

			<div className="card">
				<h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
					<FaChartBar /> Model Performance Comparison
				</h3>
				<ResponsiveContainer width="100%" height={400}>
					<BarChart data={modelData}>
						<CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
						<XAxis dataKey="model" stroke="rgba(255,255,255,0.7)" />
						<YAxis stroke="rgba(255,255,255,0.7)" />
						<Tooltip contentStyle={{ background: 'rgba(30,30,46,0.95)', border: '1px solid rgba(255,255,255,0.1)' }} />
						<Legend />
						<Bar dataKey="accuracy" fill="#00E5FF" name="Accuracy %" />
						<Bar dataKey="precision" fill="#4ECDC4" name="Precision %" />
						<Bar dataKey="recall" fill="#FFD93D" name="Recall %" />
						<Bar dataKey="f1" fill="#FF6B6B" name="F1 Score %" />
					</BarChart>
				</ResponsiveContainer>
			</div>

			<div className="grid-3" style={{ marginTop: '20px' }}>
				{modelData.map((model, idx) => (
					<div key={idx} className="card">
						<h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
							<FaBrain /> {model.model}
						</h4>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
							<div>
								<div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>Accuracy</div>
								<div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#00E5FF' }}>{model.accuracy}%</div>
							</div>
							<div>
								<div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>F1 Score</div>
								<div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#FF6B6B' }}>{model.f1}%</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

