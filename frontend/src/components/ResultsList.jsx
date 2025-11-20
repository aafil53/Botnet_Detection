import React from 'react';

export default function ResultsList({ predictions }) {
	return (
		<div className="results">
			<h3 style={{ marginTop: 30 }}>Individual Predictions</h3>
			{predictions.map((pred, idx) => {
				const className = pred.prediction === 1 ? 'botnet' : 'normal';
				const actual =
					pred.actual_label !== null && pred.actual_label !== undefined
						? pred.actual_label === 1
							? 'Botnet'
							: 'Normal'
						: null;
				return (
					<div className={`result-item ${className}`} key={idx}>
						<div className="result-header">
							<strong>Sample {idx + 1}</strong>
							<span className={`badge ${className}`}>{pred.prediction_label}</span>
						</div>
						<p>
							<strong>Probability:</strong> {(pred.probability * 100).toFixed(2)}%
						</p>
						<div className="progress-bar">
							<div
								className="progress-fill"
								style={{ width: `${(pred.probability * 100).toFixed(0)}%` }}
							/>
						</div>
						<p>
							<strong>Confidence:</strong> {(pred.confidence * 100).toFixed(2)}%
						</p>
						{actual !== null ? (
							<p>
								<strong>Actual Label:</strong> {actual}{' '}
								{pred.correct ? '✅' : '❌'}
							</p>
						) : null}
					</div>
				);
			})}
		</div>
	);
}

