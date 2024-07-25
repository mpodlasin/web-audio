<div class="wrapper">
	<header>
		<h1>audio<span class="suffix">canvas.io</span></h1>
	</header>
	<main>
		<div class="links">
			<a class="link" href="/learn">
				<h2 class="linkHeader">Learn</h2>
				<div class="linkDescription">
					Learn basics of electronic music and modular synthesis by following interactive tutorials.
				</div>
			</a>
			<a class="link" href="/playground">
				<h2 class="linkHeader">Playground</h2>
				<div class="linkDescription">
					Mess around in audiocanvas freely, build your own synths, experiment with sound.
				</div>
			</a>
		</div>
	</main>
</div>

<style>
	.wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100vw;
	}

	header {
		margin: 24px;
		font-family: var(--primary-font);
		font-size: 20px;
	}

	.suffix {
		color: var(--primary-500);
	}

	.links {
		padding: 16px;

		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	@media (min-width: 500px) {
		.links {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 18px;
			max-width: 800px;
		}
	}

	.link {
		border: 1px solid var(--neutral-500);
		border-radius: 16px;
		padding: 20px;

		display: flex;
		flex-direction: column;
		gap: 24px;

		transition: border-color 0.5s;
	}

	.link:hover {
		border: 1px solid var(--primary-500);
	}

	.linkHeader {
		margin: 0;
		text-align: center;
	}

	.linkDescription {
		color: var(--neutral-300);
	}
</style>
