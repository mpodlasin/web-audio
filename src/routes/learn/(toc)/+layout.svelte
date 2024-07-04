<div class="wrapper">
	<header>
		<h1>audio<span class="suffix">canvas.io</span></h1>
	</header>
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
	}

	.suffix {
		color: var(--primary-500);
	}

	.content {
		max-width: 800px;
		margin: 0 auto;
	}
</style>
