import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import './styles.css';

const router = createBrowserRouter(
	[
		{
			path: '/*',
			element: <App />
		}
	],
	{
		future: {
			v7_startTransition: true,
			v7_relativeSplatPath: true
		}
	}
);

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<RouterProvider router={router} />);

