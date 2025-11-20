import React from 'react';
import './ConfusionMatrix.css';

export default function ConfusionMatrix({ matrix }) {
	// matrix: [[tn, fp], [fn, tp]]
	if (!matrix) {
		return (
			<div className="chart-card">
				<h3 style={{ marginBottom: 12, textAlign: 'center' }}>Confusion Matrix</h3>
				<p className="muted small" style={{ textAlign: 'center' }}>
					No ground-truth labels provided in results. Run a detection that includes actual labels to view the matrix.
				</p>
			</div>
		);
	}
	const [row0, row1] = matrix;
	const headers = ['', 'Pred: Normal', 'Pred: Botnet'];
	const rows = [
		['Actual: Normal', row0[0], row0[1]],
		['Actual: Botnet', row1[0], row1[1]]
	];

	// Calculate max value for normalization
	const maxVal = Math.max(...matrix.flat());
	
	// Get cell color based on position and value
	const getCellStyle = (rowIdx, colIdx, value) => {
		if (colIdx === 0) {
			// Label column
			return {
				background: 'rgba(108, 99, 255, 0.1)',
				color: 'var(--text)',
				fontWeight: 600
			};
		}
		
		// Matrix cells with color coding
		const intensity = maxVal > 0 ? value / maxVal : 0;
		
		if (rowIdx === 0 && colIdx === 1) {
			// True Negative (TN) - Green
			return {
				background: `rgba(78, 205, 196, ${0.3 + intensity * 0.5})`,
				color: '#FFFFFF',
				fontWeight: 700,
				fontSize: '1.1rem'
			};
		} else if (rowIdx === 0 && colIdx === 2) {
			// False Positive (FP) - Yellow/Orange
			return {
				background: `rgba(255, 217, 61, ${0.4 + intensity * 0.4})`,
				color: '#1f2937',
				fontWeight: 700,
				fontSize: '1.1rem'
			};
		} else if (rowIdx === 1 && colIdx === 1) {
			// False Negative (FN) - Orange/Red
			return {
				background: `rgba(255, 152, 0, ${0.4 + intensity * 0.4})`,
				color: '#FFFFFF',
				fontWeight: 700,
				fontSize: '1.1rem'
			};
		} else if (rowIdx === 1 && colIdx === 2) {
			// True Positive (TP) - Red
			return {
				background: `rgba(255, 107, 107, ${0.4 + intensity * 0.5})`,
				color: '#FFFFFF',
				fontWeight: 700,
				fontSize: '1.1rem'
			};
		}
		
		return {
			background: 'var(--card-bg)',
			color: 'var(--text)'
		};
	};

	return (
		<div className="chart-card">
			<h3 style={{ marginBottom: 12, textAlign: 'center' }}>Confusion Matrix</h3>
			<div style={{ overflowX: 'auto' }}>
				<table className="confusion-matrix-table">
					<thead>
						<tr>
							{headers.map((h) => (
								<th key={h} className="confusion-header">
									{h}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{rows.map((r, i) => (
							<tr key={i}>
								{r.map((c, j) => (
									<td
										key={j}
										className="confusion-cell"
										style={getCellStyle(i, j, typeof c === 'number' ? c : 0)}
									>
										{c}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
				<div style={{ marginTop: '16px', display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', fontSize: '0.85rem' }}>
					<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
						<div style={{ width: '20px', height: '20px', background: 'rgba(78, 205, 196, 0.8)', borderRadius: '4px' }}></div>
						<span>True Negative (TN)</span>
					</div>
					<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
						<div style={{ width: '20px', height: '20px', background: 'rgba(255, 217, 61, 0.8)', borderRadius: '4px' }}></div>
						<span>False Positive (FP)</span>
					</div>
					<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
						<div style={{ width: '20px', height: '20px', background: 'rgba(255, 152, 0, 0.8)', borderRadius: '4px' }}></div>
						<span>False Negative (FN)</span>
					</div>
					<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
						<div style={{ width: '20px', height: '20px', background: 'rgba(255, 107, 107, 0.8)', borderRadius: '4px' }}></div>
						<span>True Positive (TP)</span>
					</div>
				</div>
			</div>
		</div>
	);
}

