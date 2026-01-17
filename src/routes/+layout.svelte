<script lang="ts">
	import '../app.css';
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
</script>

<svelte:head>
	<title>Minecraft Forever World Tracker</title>
	<meta name="description" content="Track your Minecraft Forever World progress - complete all blocks, mobs, biomes, advancements, and more!" />
	<meta name="theme-color" content="#1D1D21" />
	<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⛏️</text></svg>" />
</svelte:head>

{@render children()}
