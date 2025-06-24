<script lang="ts">
	import Close from '../icons/Close_MD.svg?component';
	import type { Notification } from './AudioCanvas/notifications.svelte';

	interface Props {
		notification: Notification;
		onDismiss: (id: string) => void;
	}

	let { notification, onDismiss }: Props = $props();

	const handleDismiss = () => {
		onDismiss(notification.id);
	};

	const handleKeydown = (event: KeyboardEvent) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			handleDismiss();
		}
	};
</script>

<div class="notification notification--{notification.type}" role="alert" aria-live="polite">
	<div class="notification__content">
		<span class="notification__message">{notification.message}</span>
		<button
			class="notification__close"
			onclick={handleDismiss}
			onkeydown={handleKeydown}
			aria-label="Close notification"
			title="Close notification"
		>
			<Close />
		</button>
	</div>
</div>

<style>
	.notification {
		display: flex;
		align-items: center;
		min-height: 48px;
		padding: 12px 16px;
		border-radius: 8px;
		border: 1px solid;
		background-color: var(--neutral-700);
		color: var(--neutral-300);
		font-family: 'Inter', arial;
		font-size: 14px;
		line-height: 1.4;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
		animation: slideIn 0.3s ease-out;
		max-width: 400px;
		word-wrap: break-word;
	}

	.notification__content {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		gap: 12px;
	}

	.notification__message {
		flex: 1;
	}

	.notification__close {
		background: none;
		border: none;
		color: inherit;
		cursor: pointer;
		padding: 4px;
		border-radius: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background-color 0.2s;
		flex-shrink: 0;
	}

	.notification__close:hover {
		background-color: rgba(255, 255, 255, 0.1);
	}

	.notification__close:focus {
		outline: 2px solid var(--primary-500);
		outline-offset: 2px;
	}

	/* Notification type variants */
	.notification--success {
		border-color: var(--success-500);
		background-color: rgba(61, 220, 151, 0.1);
	}

	.notification--error {
		border-color: var(--danger-300);
		background-color: rgba(255, 97, 97, 0.1);
	}

	.notification--warning {
		border-color: #ffa500;
		background-color: rgba(255, 165, 0, 0.1);
	}

	.notification--info {
		border-color: var(--primary-500);
		background-color: rgba(69, 199, 255, 0.1);
	}

	/* Animation */
	@keyframes slideIn {
		from {
			transform: translateX(-100%);
			opacity: 0;
		}
		to {
			transform: translateX(0);
			opacity: 1;
		}
	}

	/* Responsive design */
	@media (max-width: 480px) {
		.notification {
			max-width: calc(100vw - 32px);
			font-size: 13px;
		}
	}
</style>
