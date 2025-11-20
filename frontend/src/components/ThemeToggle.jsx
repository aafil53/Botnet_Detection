import React from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import './ThemeToggle.css';

export default function ThemeToggle({ isDark, onToggle }) {
	return (
		<button className="theme-toggle" onClick={onToggle} aria-label="Toggle theme">
			{isDark ? <FaSun /> : <FaMoon />}
		</button>
	);
}

