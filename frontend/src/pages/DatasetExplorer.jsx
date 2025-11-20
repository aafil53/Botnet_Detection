import React, { useEffect, useState } from 'react';
import { FaDatabase, FaSearch, FaFilter, FaDownload, FaChartBar } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function DatasetExplorer({ token, api }) {
	const [datasetInfo, setDatasetInfo] = useState(null);
	const [samples, setSamples] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState('');
	const [numSamples, setNumSamples] = useState(20);

	useEffect(() => {
		loadDatasetData();
	}, []);

	const loadDatasetData = async () => {
		setLoading(true);
		try {
			const [info, sampleData] = await Promise.all([
				api.getDatasetInfo(token),
				api.getRandomSamples(token, numSamples, true)
			]);
			setDatasetInfo(info);
			setSamples(sampleData.samples || []);
		} catch (err) {
			toast.error(err.message || 'Failed to load dataset');
			console.error('Error loading dataset:', err);
		} finally {
			setLoading(false);
		}
	};

	const handleRefresh = () => {
		loadDatasetData();
	};

	const filteredSamples = samples.filter((sample) => {
		if (!searchTerm) return true;
		const searchLower = searchTerm.toLowerCase();
		return Object.values(sample).some((val) => 
			String(val).toLowerCase().includes(searchLower)
		);
	});

	if (loading) {
		return (
			<div className="page-container">
				<div className="card" style={{ textAlign: 'center', padding: '40px' }}>
					<div className="spinner" style={{ margin: '0 auto' }} />
					<p className="muted" style={{ marginTop: '16px' }}>Loading dataset...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="page-container dataset-explorer-page">
			<div className="page-hero">
				<div>
					<h2 className="page-title">Dataset Explorer</h2>
					<p className="page-subtitle">Browse and visualize network flow datasets</p>
				</div>
				<div className="page-hero-actions">
					<button className="btn" onClick={handleRefresh}>
						<FaDownload /> Refresh Data
					</button>
				</div>
			</div>

			{datasetInfo && (
				<div className="grid-3" style={{ marginBottom: '24px' }}>
					<div className="card glass-panel">
						<div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
							<FaDatabase style={{ color: '#00E5FF', fontSize: '24px' }} />
							<h3 style={{ margin: 0 }}>Total Samples</h3>
						</div>
						<p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>
							{datasetInfo.total_samples?.toLocaleString() || 'N/A'}
						</p>
						<p className="muted small">Network flow records</p>
					</div>
					<div className="card glass-panel">
						<div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
							<FaChartBar style={{ color: '#4ECDC4', fontSize: '24px' }} />
							<h3 style={{ margin: 0 }}>Features</h3>
						</div>
						<p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>
							{datasetInfo.num_features || 'N/A'}
						</p>
						<p className="muted small">Feature dimensions</p>
					</div>
					<div className="card glass-panel">
						<div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
							<FaDatabase style={{ color: '#FF6B6B', fontSize: '24px' }} />
							<h3 style={{ margin: 0 }}>Botnet Rate</h3>
						</div>
						<p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>
							{datasetInfo.botnet_percentage ? `${datasetInfo.botnet_percentage}%` : 'N/A'}
						</p>
						<p className="muted small">
							{datasetInfo.botnet_samples || 0} botnet / {datasetInfo.normal_samples || 0} normal
						</p>
					</div>
				</div>
			)}

			<div className="card dataset-toolbar">
				<div className="toolbar-inputs">
					<div className="input-wrapper">
						<FaSearch className="input-icon" />
						<input 
							type="text" 
							placeholder="Search samples..." 
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>
					<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
						<label className="muted small">Samples:</label>
						<input
							type="number"
							min="1"
							max="100"
							value={numSamples}
							onChange={(e) => setNumSamples(parseInt(e.target.value) || 20)}
							style={{ width: '80px', padding: '8px', borderRadius: '8px', border: '1px solid var(--card-border)' }}
						/>
						<button className="btn subtle" onClick={handleRefresh}>Load</button>
					</div>
				</div>
			</div>

			<div className="card">
				<h3 style={{ marginBottom: '16px' }}>Sample Data ({filteredSamples.length} shown)</h3>
				<div style={{ overflowX: 'auto' }}>
					<table style={{ width: '100%', borderCollapse: 'collapse' }}>
						<thead>
							<tr style={{ borderBottom: '2px solid var(--card-border)' }}>
								<th style={{ padding: '12px', textAlign: 'left' }}>Sample #</th>
								<th style={{ padding: '12px', textAlign: 'left' }}>Label</th>
								{datasetInfo?.feature_names?.slice(0, 8).map((feature, idx) => (
									<th key={idx} style={{ padding: '12px', textAlign: 'left' }}>
										{feature}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{filteredSamples.length > 0 ? (
								filteredSamples.map((sample, idx) => (
									<tr key={idx} style={{ borderBottom: '1px solid var(--card-border)' }}>
										<td style={{ padding: '12px' }}>{idx + 1}</td>
										<td style={{ padding: '12px' }}>
											<span className={`badge ${sample._actual_label === 1 ? 'botnet' : 'normal'}`}>
												{sample._actual_label === 1 ? 'Botnet' : 'Normal'}
											</span>
										</td>
										{datasetInfo?.feature_names?.slice(0, 8).map((feature, fIdx) => (
											<td key={fIdx} style={{ padding: '12px', fontFamily: 'monospace', fontSize: '0.85rem' }}>
												{typeof sample[feature] === 'number' 
													? sample[feature].toFixed(4) 
													: String(sample[feature] || '-')}
											</td>
										))}
									</tr>
								))
							) : (
								<tr>
									<td colSpan={10} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
										No samples found. Try refreshing the data.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}

