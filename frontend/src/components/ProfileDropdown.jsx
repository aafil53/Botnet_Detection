import React, { useState, useRef, useEffect } from 'react';
import { FaUser, FaCog, FaSignOutAlt, FaChevronDown } from 'react-icons/fa';
import './ProfileDropdown.css';

export default function ProfileDropdown({ userEmail, onLogout, onSettings }) {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef(null);

	useEffect(() => {
		function handleClickOutside(event) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsOpen(false);
			}
		}

		if (isOpen) {
			// Use setTimeout to ensure the click event has finished processing
			setTimeout(() => {
				document.addEventListener('mousedown', handleClickOutside);
			}, 0);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isOpen]);

	const handleToggle = (e) => {
		e.stopPropagation();
		setIsOpen(!isOpen);
	};

	const handleSettingsClick = (e) => {
		e.stopPropagation();
		setIsOpen(false);
		if (onSettings) onSettings();
	};

	const handleLogoutClick = (e) => {
		e.stopPropagation();
		setIsOpen(false);
		if (onLogout) onLogout();
	};

	return (
		<div className="profile-dropdown" ref={dropdownRef}>
			<button
				className="profile-trigger"
				onClick={handleToggle}
				aria-expanded={isOpen}
				type="button"
			>
				<div className="profile-avatar">
					<FaUser />
				</div>
				<span className="profile-email">{userEmail}</span>
				<FaChevronDown className={`chevron ${isOpen ? 'open' : ''}`} />
			</button>

			{isOpen && (
				<div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
					<button className="dropdown-item" onClick={handleSettingsClick} type="button">
						<FaCog />
						<span>Settings</span>
					</button>
					<button className="dropdown-item danger" onClick={handleLogoutClick} type="button">
						<FaSignOutAlt />
						<span>Logout</span>
					</button>
				</div>
			)}
		</div>
	);
}

