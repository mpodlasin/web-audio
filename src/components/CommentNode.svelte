<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { type SerializedCommentNode } from '../audio/serialized';

	const dispatcher = createEventDispatcher();

	export let id: string;
	export let node: SerializedCommentNode;
	$: comment = node.comment;

	let editMode = false;

	let editedComment = '';

	const stopEditing = () => {
		editMode = false;

		dispatcher('commentChanged', {
			comment: editedComment,
			nodeId: id
		});

		editedComment = '';
	};

	let textarea: HTMLTextAreaElement;

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
	<!-- svelte-ignore a11y-autofocus -->
	<textarea
		bind:this={textarea}
		autofocus
		rows={5}
		on:keypress={handleEnter}
		bind:value={editedComment}
	/>
{:else}
	<div
		class="comment"
		on:click={handleCommentClick}
		on:pointerup={(e) => e.stopPropagation()}
		on:pointerdown={(e) => e.stopPropagation()}
		on:keypress={() => {}}
	>
		{comment || 'Empty comment'}
	</div>
{/if}

<style>
	.comment {
		font-size: 12px;
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
