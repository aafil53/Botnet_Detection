import React from 'react';

function toCsv(data) {
	if (!data?.predictions?.length) return '';
	const headers = [
		'index',
		'prediction',
		'prediction_label',
		'probability',
		'confidence',
		'actual_label'
	];
	const rows = data.predictions.map((p, i) => [
		i + 1,
		p.prediction,
		p.prediction_label,
		p.probability,
		p.confidence,
		p.actual_label
	]);
	const escape = (v) =>
		typeof v === 'string' && v.includes(',') ? `"${v.replace(/"/g, '""')}"` : v;
	return [headers.join(','), ...rows.map((r) => r.map(escape).join(','))].join('\n');
}

export default function Reports() {
	let last = null;
	try {
		last = JSON.parse(localStorage.getItem('lastDetection') || 'null');
	} catch {
		last = null;
	}

	const download = (blob, filename) => {
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		a.remove();
		URL.revokeObjectURL(url);
	};

	const downloadJson = () => {
		const blob = new Blob([JSON.stringify(last ?? {}, null, 2)], {
			type: 'application/json'
		});
		download(blob, 'botnet_report.json');
	};

	const downloadCsv = () => {
		const csv = toCsv(last ?? { predictions: [] });
		const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
		download(blob, 'botnet_predictions.csv');
	};

	return (
		<div className="card">
			<h2>Reports</h2>
			<p className="muted small">
				Download your latest detection results in CSV or JSON format
			</p>
			<div className="actions" style={{ marginTop: 12 }}>
				<button className="btn" onClick={downloadJson} disabled={!last}>
					Download JSON
				</button>
				<button className="btn" onClick={downloadCsv} disabled={!last || !last?.predictions?.length}>
					Download CSV
				</button>
			</div>
			{!last ? (
				<p className="muted" style={{ marginTop: 12 }}>
					No recent results found. Run a detection to generate a report.
				</p>
			) : null}
		</div>
	);
}

