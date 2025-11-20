import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
	build: {
		outDir: 'dist'
	},
	plugins: [react()],
	server: {
		host: true,
		port: 5173
	},
	optimizeDeps: {
		include: ['react-force-graph-2d']
	}
});

