export function isNotificationSupported() {
	try {
		return 'Notification' in window;
	} catch {
		return false;
	}
}

export async function ensureNotificationPermission() {
	if (!isNotificationSupported()) return false;
	if (Notification.permission === 'granted') return true;
	if (Notification.permission === 'denied') return false;
	try {
		const res = await Notification.requestPermission();
		return res === 'granted';
	} catch {
		return false;
	}
}

export async function showNotification(title, options = {}) {
	if (!isNotificationSupported()) return false;
	const granted =
		Notification.permission === 'granted' || (await ensureNotificationPermission());
	if (!granted) return false;
	try {
		new Notification(title, {
			icon: '/logo.svg',
			badge: '/logo.svg',
			...options
		});
		return true;
	} catch {
		return false;
	}
}

export function notificationsEnabled() {
	try {
		return localStorage.getItem('enableBrowserNotifications') === 'true';
	} catch {
		return false;
	}
}

export function setNotificationsEnabled(enabled) {
	try {
		localStorage.setItem('enableBrowserNotifications', String(!!enabled));
	} catch {}
}

