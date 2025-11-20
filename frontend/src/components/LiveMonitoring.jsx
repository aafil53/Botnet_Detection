import React, { useMemo, useRef, useState } from 'react';
import StatsGrid from './StatsGrid.jsx';
import { notificationsEnabled, showNotification } from '../utils/notify.js';

export default function LiveMonitoring({ token, userEmail, api }) {
	const [duration, setDuration] = useState(30);
	const [interval, setIntervalVal] = useState(2);
	const [alertThreshold, setAlertThreshold] = useState(0.8);
	const [enableEmail, setEnableEmail] = useState(() => {
		const saved = localStorage.getItem('enableEmailAlerts');
		return saved ? saved === 'true' : true;
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [results, setResults] = useState(null);
	const [feed, setFeed] = useState([]);
	const streamingRef = useRef(false);
	const timerRef = useRef(0);

	const onStart = async () => {
		setError('');
		if (!token) {
			setError('Authentication token is missing. Please log in again.');
			return;
		}
		if (duration < 10 || duration > 300) {
			setError('Duration must be between 10 and 300 seconds');
			return;
		}
		try {
			localStorage.setItem('enableEmailAlerts', String(enableEmail));
		} catch {}
		setLoading(true);
		try {
			const data = await api.startMonitoring(token, {
				duration,
				interval,
				alertThreshold: enableEmail ? alertThreshold : 1 // disable emails by using high threshold
			});
			setResults(data);
			// Summary notification
			if (notificationsEnabled()) {
				const botnets = data.summary?.botnet_detected ?? 0;
				const isDanger = botnets > 0;
				showNotification(isDanger ? 'Botnet Detected (Monitoring)' : 'Monitoring Complete', {
					body: isDanger ? `${botnets} threat(s) detected.` : `No threats detected.`
				});
			}
		} catch (err) {
			setError(err.message);
			// If it's an authentication error, suggest logging in again
			if (err.message.includes('Session expired') || err.message.includes('Authentication token')) {
				setError(`${err.message} Please refresh the page and log in again.`);
			}
		} finally {
			setLoading(false);
		}
	};

	const onStartStreaming = async () => {
		if (streamingRef.current) return;
		setFeed([]);
		setError('');
		streamingRef.current = true;
		timerRef.current = window.setInterval(async () => {
			if (!streamingRef.current) {
				window.clearInterval(timerRef.current);
				return;
			}
			try {
				const pkt = await api.streamPacket(token);
				setFeed((prev) => {
					const next = [
						{
							...pkt,
							_sampleId: (prev[0]?._sampleId || 0) + 1
						},
						...prev
					];
					return next.slice(0, 20);
				});
				// Event notification for botnet packets
				if (notificationsEnabled() && pkt?.prediction === 1) {
					showNotification('Botnet Packet Detected', {
						body: `Confidence ${(pkt.confidence * 100).toFixed(1)}%`
					});
				}
			} catch (err) {
				// stop on error to avoid spamming
				streamingRef.current = false;
			}
		}, 2000);
	};

	const onStopStreaming = () => {
		streamingRef.current = false;
		window.clearInterval(timerRef.current);
	};

	const summaryStats = useMemo(() => {
		if (!results?.summary) return [];
		const s = results.summary;
		return [
			{ label: 'Packets Analyzed', value: s.total_samples },
			{ label: 'Threats Detected', value: s.botnet_detected },
			{ label: 'Email Alerts Sent', value: s.alerts_sent },
			{ label: 'Detection Rate', value: `${s.detection_rate}%` }
		];
	}, [results]);

	return (
		<div className="card" style={{ marginTop: 24 }}>
			<h2>🔴 Live Traffic Monitoring</h2>
			<p className="muted" style={{ marginBottom: 16 }}>
				Simulate real-time network traffic monitoring and botnet detection
			</p>

			<div className="grid-3">
				<div className="form-group">
					<label>Monitoring Duration (seconds)</label>
					<input
						type="number"
						min="10"
						max="300"
						value={duration}
						onChange={(e) => setDuration(parseInt(e.target.value || '0', 10))}
					/>
				</div>
				<div className="form-group">
					<label>Sampling Interval (seconds)</label>
					<input
						type="number"
						min="0.5"
						max="10"
						step="0.5"
						value={interval}
						onChange={(e) => setIntervalVal(parseFloat(e.target.value || '0'))}
					/>
				</div>
				<div className="form-group">
					<label>Alert Threshold (probability)</label>
					<input
						type="number"
						min="0.5"
						max="1"
						step="0.05"
						value={alertThreshold}
						onChange={(e) => setAlertThreshold(parseFloat(e.target.value || '0'))}
					/>
				</div>
				<div className="form-group">
					<label>Email Alerts</label>
					<label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
						<input
							type="checkbox"
							checked={enableEmail}
							onChange={(e) => setEnableEmail(e.target.checked)}
							style={{ width: 18, height: 18 }}
						/>
						<span className="small muted">Send an email when probability crosses threshold</span>
					</label>
				</div>
			</div>

			<div className="actions">
				<button
					className="btn danger"
					onClick={onStart}
					disabled={loading}
					style={{ marginRight: 12 }}
				>
					{loading ? <span className="spinner" aria-hidden /> : '🔴'}
					{loading ? 'Monitoring in Progress…' : 'Start Live Monitoring'}
				</button>
				<button className="btn" onClick={onStartStreaming} style={{ marginRight: 8 }}>
					📡 Start Streaming Mode
				</button>
				<button className="btn" onClick={onStopStreaming}>
					⏹️ Stop Streaming Mode
				</button>
			</div>
			{error ? (
				<p className="error" role="alert" style={{ marginTop: 10 }}>
					{error}
				</p>
			) : null}

			{results ? (
				<div style={{ marginTop: 16 }}>
					<h3>Monitoring Complete</h3>
					<StatsGrid items={summaryStats} />
					<h3 style={{ marginTop: 30 }}>Live Detection Feed</h3>
					<div>
						{results.detections.map((det, i) => {
							const isBotnet = det.prediction === 1;
							const className = isBotnet ? 'botnet-alert' : 'normal';
							const time = new Date(det.timestamp).toLocaleTimeString();
							return (
								<div className={`live-feed ${className}`} key={i}>
									<div>
										<strong>Packet #{det.sample_id}</strong> -{' '}
										<span className="live-feed-time">{time}</span>
										<br />
										<strong>Status:</strong> {det.prediction_label} (Confidence:{' '}
										{(det.confidence * 100).toFixed(1)}%){' '}
										{det.alert_sent ? <span className="alert-badge">📧 ALERT SENT</span> : null}
									</div>
									<div>
										<div className={`badge ${className}`}>{det.prediction_label}</div>
									</div>
								</div>
							);
						})}
					</div>
					{results.summary.alerts_sent > 0 ? (
						<div className="alert-info">
							<h4>📧 Email Alerts</h4>
							<p>
								<strong>{results.summary.alerts_sent}</strong> email alert(s) sent to{' '}
								<strong>{userEmail}</strong>
							</p>
							<p className="muted small">Check your inbox for detailed threat reports.</p>
						</div>
					) : null}
				</div>
			) : null}

			{feed.length ? (
				<div style={{ marginTop: 16 }}>
					<h3>Live Streaming Mode</h3>
					<p className="muted small">New packets appear every 2 seconds…</p>
					<div>
						{feed.map((data) => {
							const isBotnet = data.prediction === 1;
							const className = isBotnet ? 'botnet-alert' : 'normal';
							const time = new Date(data.timestamp).toLocaleTimeString();
							return (
								<div className={`live-feed ${className}`} key={data._sampleId}>
									<div>
										<strong>Packet #{data._sampleId}</strong> -{' '}
										<span className="live-feed-time">{time}</span>
										<br />
										<strong>Status:</strong> {data.prediction_label} (Confidence:{' '}
										{(data.confidence * 100).toFixed(1)}%)
									</div>
									<div>
										<div className={`badge ${className}`}>{data.prediction_label}</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			) : null}
		</div>
	);
}

