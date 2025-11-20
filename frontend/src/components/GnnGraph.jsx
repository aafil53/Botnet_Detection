import React, { useMemo } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

export default function GnnGraph({ predictions }) {
	// Build a simple similarity graph: link consecutive samples and group by predicted label
	const data = useMemo(() => {
		if (!predictions || !predictions.length) return { nodes: [], links: [] };
		const nodes = predictions.map((p, i) => ({
			id: i + 1,
			name: `S${i + 1}`,
			pred: p.prediction === 1 ? 'Botnet' : 'Normal',
			color: p.prediction === 1 ? '#e74c3c' : '#27ae60',
			prob: p.probability
		}));
		const links = [];
		for (let i = 0; i < nodes.length - 1; i++) {
			links.push({ source: nodes[i].id, target: nodes[i + 1].id, value: 1 });
		}
		// Additional weak links among same-label neighbors
		for (let i = 0; i < nodes.length; i++) {
			for (let j = i + 1; j < Math.min(nodes.length, i + 6); j++) {
				if (predictions[i].prediction === predictions[j].prediction) {
					links.push({ source: nodes[i].id, target: nodes[j].id, value: 0.5 });
				}
			}
		}
		return { nodes, links };
	}, [predictions]);

	if (!data.nodes.length) return null;

	return (
		<div className="chart-card center">
			<h3 style={{ marginBottom: 12, textAlign: 'center' }}>GNN Graph (sample similarity)</h3>
			<div
				className="graph-wrapper"
				onWheel={(e) => {
					// prevent page scroll when zooming the graph
					e.preventDefault();
					e.stopPropagation();
				}}
				style={{
					width: '100%',
					maxWidth: 900,
					height: 420,
					margin: '0 auto',
					overflow: 'hidden',
					borderRadius: 12
				}}
			>
				<ForceGraph2D
					graphData={data}
					nodeCanvasObject={(node, ctx, globalScale) => {
						const label = `${node.name} (${node.pred})`;
						const fontSize = 12 / globalScale;
						ctx.fillStyle = node.color;
						ctx.beginPath();
						ctx.arc(node.x, node.y, 6, 0, 2 * Math.PI, false);
						ctx.fill();
						ctx.font = `${fontSize}px Sans-Serif`;
						ctx.textAlign = 'left';
						ctx.textBaseline = 'middle';
						ctx.fillStyle = '#111827';
						ctx.fillText(label, node.x + 8, node.y);
					}}
					linkColor={() => '#cbd5e1'}
					linkWidth={(link) => (link.value === 1 ? 1.6 : 0.6)}
					cooldownTicks={60}
				/>
			</div>
		</div>
	);
}

