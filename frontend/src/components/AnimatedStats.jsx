import React from 'react';
import { FaShieldAlt, FaBrain, FaChartLine, FaClock } from 'react-icons/fa';
import './AnimatedStats.css';

export default function AnimatedStats({ stats = {} }) {
	const {
		totalPackets = 0,
		detectedBotnets = 0,
		modelAccuracy = 0,
		avgDetectionTime = 0
	} = stats;

	const statCards = [
		{
			icon: FaShieldAlt,
			label: 'Total Packets Analyzed',
			value: totalPackets.toLocaleString(),
			color: '#00E5FF',
			delay: 0
		},
		{
			icon: FaBrain,
			label: 'Detected Botnets',
			value: detectedBotnets.toLocaleString(),
			color: '#FF6B6B',
			delay: 0.1
		},
		{
			icon: FaChartLine,
			label: 'Model Accuracy',
			value: modelAccuracy !== null && modelAccuracy !== undefined 
				? `${Number(modelAccuracy).toFixed(1)}%` 
				: 'N/A',
			color: '#4ECDC4',
			delay: 0.2
		},
		{
			icon: FaClock,
			label: 'Avg Detection Time',
			value: avgDetectionTime !== null && avgDetectionTime !== undefined 
				? `${Number(avgDetectionTime).toFixed(2)}s` 
				: 'N/A',
			color: '#FFD93D',
			delay: 0.3
		}
	];

	return (
		<div className="animated-stats">
			{statCards.map((stat, idx) => {
				const Icon = stat.icon;
				return (
					<div
						key={idx}
						className="stat-card"
						style={{
							'--delay': `${stat.delay}s`,
							'--glow-color': stat.color
						}}
					>
						<div className="stat-icon" style={{ color: stat.color }}>
							<Icon />
						</div>
						<div className="stat-content">
							<div className="stat-value">{stat.value}</div>
							<div className="stat-label">{stat.label}</div>
						</div>
					</div>
				);
			})}
		</div>
	);
}

