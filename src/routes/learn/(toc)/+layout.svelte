<div class="wrapper">
	<a href="/">
		<header>
			<h1>audio<span class="suffix">canvas.io</span></h1>
		</header>
	</a>
	<main class="content">
		<slot />
	</main>
</div>

<style>
	.wrapper {
		width: 100vw;
	}

	header {
		text-align: center;
		padding: 24px;
		color: var(--neutral-300);
	}

	.suffix {
		color: var(--primary-500);
	}

	.content {
		max-width: 800px;
		padding: 0 16px;
		margin: 0 auto;
	}
</style>
