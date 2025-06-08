<script lang="ts">
	import { type SerializedCommentNode } from '../audio/serialized';

	interface Props {
		id: string;
		node: SerializedCommentNode;
		onCommentChanged?: (event: { comment: string; nodeId: string }) => void;
	}

	let { id, node, onCommentChanged }: Props = $props();
	let comment = $derived(node.comment);

	let editMode = $state(false);

	let editedComment = $state('');

	const stopEditing = () => {
		editMode = false;

		onCommentChanged?.({
			comment: editedComment,
			nodeId: id
		});

		editedComment = '';
	};

	let textarea: HTMLTextAreaElement | undefined = $state();

	const stopPropagation = (e: Event) => e.stopPropagation();

	const stopEditingOnClick = (e: MouseEvent) => {
		e.stopPropagation();

		if (e.target === textarea) {
			window.addEventListener('click', stopEditingOnClick, { once: true, capture: true });
			window.addEventListener('pointerup', stopPropagation, { once: true, capture: true });
			window.addEventListener('pointerdown', stopPropagation, { once: true, capture: true });

			return;
		}

		stopEditing();
	};

	const handleCommentClick = (e: MouseEvent) => {
		e.stopPropagation();

		editMode = true;
		editedComment = comment;

		window.addEventListener('click', stopEditingOnClick, { once: true, capture: true });
		window.addEventListener('pointerup', stopPropagation, { once: true, capture: true });
		window.addEventListener('pointerdown', stopPropagation, { once: true, capture: true });
	};

	const handleEnter = (e: KeyboardEvent) => {
		if (e.code === 'Enter') {
			stopEditing();

			window.removeEventListener('click', stopEditingOnClick, { capture: true });
			window.removeEventListener('pointerup', stopPropagation, { capture: true });
			window.removeEventListener('pointerdown', stopPropagation, { capture: true });
		}
	};
</script>

{#if editMode}
	<!-- svelte-ignore a11y_autofocus -->
	<textarea
		bind:this={textarea}
		autofocus
		rows={5}
		onkeypress={handleEnter}
		bind:value={editedComment}
	></textarea>
{:else}
	<button
		class="comment"
		onclick={handleCommentClick}
		onpointerup={(e) => e.stopPropagation()}
		onpointerdown={(e) => e.stopPropagation()}
	>
		{comment || 'Empty comment'}
	</button>
{/if}

<style>
	.comment {
		font-size: 12px;
		max-width: 210px;
	}

	textarea {
		background-color: var(--neutral-700);
		color: var(--neutral-300);
		border-radius: 4px;
		width: 200px;
		padding: 4px;
		font-size: 12px;
	}
</style>
