<script lang="ts">
	import Notification from './Notification.svelte';
	import type { NotificationStore } from './AudioCanvas/notifications.svelte';

	interface Props {
		notificationStore: NotificationStore;
	}

	let { notificationStore }: Props = $props();

	const handleDismiss = (id: string) => {
		notificationStore.dismiss(id);
	};
</script>

{#if notificationStore.notifications.length > 0}
	<div class="notification-container">
		{#each notificationStore.notifications as notification (notification.id)}
			<div class="notification-wrapper">
				<Notification {notification} onDismiss={handleDismiss} />
			</div>
		{/each}
	</div>
{/if}

<style>
	.notification-container {
		position: fixed;
		bottom: 16px;
		right: 16px;
		z-index: 10000;
		display: flex;
		flex-direction: column;
		gap: 8px;
		pointer-events: none;
	}

	.notification-wrapper {
		pointer-events: auto;
		animation: slideInUp 0.3s ease-out;
	}

	/* Animation for new notifications appearing */
	@keyframes slideInUp {
		from {
			transform: translateY(20px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	/* Responsive positioning */
	@media (max-width: 480px) {
		.notification-container {
			left: 8px;
			right: 8px;
			bottom: 8px;
		}
	}

	/* Ensure notifications don't interfere with other UI elements */
	@media (max-height: 600px) {
		.notification-container {
			max-height: 200px;
			overflow-y: auto;
		}
	}
</style>
