export interface Notification {
	id: string;
	type: 'success' | 'error' | 'warning' | 'info';
	message: string;
	duration: number;
	timestamp: number;
}

export interface NotificationOptions {
	duration?: number;
}

export class NotificationStore {
	notifications = $state<Notification[]>([]);
	private timeouts = new Map<string, number>();

	private generateId(): string {
		return Math.random().toString(36).substr(2, 9);
	}

	private addNotification(
		type: Notification['type'],
		message: string,
		options: NotificationOptions = {}
	) {
		const id = this.generateId();
		const duration = options.duration ?? 4000;
		const timestamp = Date.now();

		const notification: Notification = {
			id,
			type,
			message,
			duration,
			timestamp
		};

		this.notifications.push(notification);

		// Set up auto-dismiss
		if (duration > 0) {
			const timeoutId = window.setTimeout(() => {
				this.dismiss(id);
			}, duration);
			this.timeouts.set(id, timeoutId);
		}
	}

	success(message: string, options?: NotificationOptions) {
		this.addNotification('success', message, options);
	}

	error(message: string, options?: NotificationOptions) {
		this.addNotification('error', message, options);
	}

	warning(message: string, options?: NotificationOptions) {
		this.addNotification('warning', message, options);
	}

	info(message: string, options?: NotificationOptions) {
		this.addNotification('info', message, options);
	}

	dismiss(id: string) {
		// Clear timeout if it exists
		const timeoutId = this.timeouts.get(id);
		if (timeoutId) {
			window.clearTimeout(timeoutId);
			this.timeouts.delete(id);
		}

		// Remove notification from array
		this.notifications = this.notifications.filter((n) => n.id !== id);
	}

	clear() {
		// Clear all timeouts
		this.timeouts.forEach((timeoutId) => window.clearTimeout(timeoutId));
		this.timeouts.clear();

		// Clear all notifications
		this.notifications = [];
	}
}
