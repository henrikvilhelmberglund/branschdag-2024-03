<script>
	import { afterUpdate } from "svelte";

	export let lightMode;

	afterUpdate(() => {
		lightMode = lightMode;
		if (lightMode) {
			window.document.body.classList.remove("dark");
		} else {
			window.document.body.classList.add("dark");
		}
	});

	function toggle() {
		window.document.body.classList.toggle("dark");
		lightMode = !lightMode;
	}
</script>

<button on:click={toggle}>
	{lightMode ? "🌙" : "🌞"}
</button>

<style>
	button {
		top: 0;
		right: 0;
		position: absolute;
		background-color: #222222;
		color: white;
		border: none;
		border-radius: 4px;
		padding: 0.2rem;
		text-transform: uppercase;
    font-size: 2rem;
	}
	:global(body.dark) button {
		background-color: #aaaaaa;
		color: white;
	}
</style>
