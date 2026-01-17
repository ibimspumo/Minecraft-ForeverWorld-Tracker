<script lang="ts">
	interface Props {
		icon?: string;
		size?: 'sm' | 'md' | 'lg';
		completed?: boolean;
		interactive?: boolean;
		onclick?: () => void;
	}

	let {
		icon,
		size = 'md',
		completed = false,
		interactive = false,
		onclick
	}: Props = $props();

	let imageError = $state(false);
	let currentSourceIndex = $state(0);

	// Multiple image source strategies for Minecraft Wiki
	function getImageSources(iconName: string): string[] {
		// Convert snake_case to Title_Case
		const titleCase = iconName
			.split('_')
			.map(word => word.charAt(0).toUpperCase() + word.slice(1))
			.join('_');

		// Base wiki URL
		const wikiBase = 'https://minecraft.wiki/images';

		return [
			// Invicon format (inventory icons, works for blocks/items)
			`${wikiBase}/Invicon_${titleCase}.png`,
			// Spawn egg format (works for mobs)
			`${wikiBase}/Invicon_${titleCase}_Spawn_Egg.png`,
			// Direct block/item texture
			`${wikiBase}/${titleCase}.png`,
			// Grid format
			`${wikiBase}/Grid_${titleCase}.png`,
			// Some items use different naming
			`${wikiBase}/${titleCase}_(item).png`,
			// Face/head format for some mobs
			`${wikiBase}/${titleCase}_Face.png`,
		];
	}

	function handleImageError() {
		const sources = icon ? getImageSources(icon) : [];
		if (currentSourceIndex < sources.length - 1) {
			currentSourceIndex++;
		} else {
			imageError = true;
		}
	}

	// Reset state when icon changes
	$effect(() => {
		if (icon) {
			imageError = false;
			currentSourceIndex = 0;
		}
	});

	const currentSrc = $derived(icon ? getImageSources(icon)[currentSourceIndex] : '');

	// Generate a consistent color from icon name for fallback
	function getIconColor(name: string): string {
		const colors = [
			'#8B7355', '#4A90D9', '#E74C3C', '#27AE60', '#9B59B6',
			'#F1C40F', '#E91E63', '#1ABC9C', '#E67E22', '#3498DB'
		];
		let hash = 0;
		for (let i = 0; i < name.length; i++) {
			hash = name.charCodeAt(i) + ((hash << 5) - hash);
		}
		return colors[Math.abs(hash) % colors.length];
	}

	const sizeClasses = {
		sm: 'slot--sm',
		md: 'slot--md',
		lg: 'slot--lg'
	};
</script>

<div
	class="slot {sizeClasses[size]}"
	class:slot--completed={completed}
	class:slot--interactive={interactive}
	onclick={interactive ? onclick : undefined}
	role={interactive ? 'button' : undefined}
	tabindex={interactive ? 0 : undefined}
	onkeydown={interactive ? (e) => e.key === 'Enter' && onclick?.() : undefined}
>
	{#if icon && !imageError}
		<img
			src={currentSrc}
			alt=""
			class="slot__image"
			loading="lazy"
			onerror={handleImageError}
		/>
	{:else if icon && imageError}
		<div
			class="slot__fallback"
			style="background-color: {getIconColor(icon)}"
		>
			{icon.charAt(0).toUpperCase()}
		</div>
	{/if}
	{#if completed}
		<div class="slot__check">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
				<path d="M20 6 9 17l-5-5"/>
			</svg>
		</div>
	{/if}
</div>

<style>
	.slot {
		background: var(--mc-slot-bg);
		border: 2px solid;
		border-color: var(--mc-inventory-border-dark) var(--mc-inventory-border-light) var(--mc-inventory-border-light) var(--mc-inventory-border-dark);
		box-shadow: inset 2px 2px 4px rgba(0,0,0,0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		aspect-ratio: 1;
		position: relative;
		transition: all var(--transition-fast);
		image-rendering: pixelated;
	}

	.slot--sm { width: 32px; }
	.slot--md { width: 48px; }
	.slot--lg { width: 64px; }

	.slot--interactive {
		cursor: pointer;
	}

	.slot--interactive:hover {
		background: var(--mc-slot-hover);
		transform: scale(1.05);
	}

	.slot--interactive:active {
		transform: scale(0.98);
	}

	.slot--completed {
		background: rgba(128, 255, 32, 0.2);
	}

	.slot__image {
		width: 80%;
		height: 80%;
		object-fit: contain;
		image-rendering: pixelated;
	}

	.slot__fallback {
		width: 70%;
		height: 70%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: var(--font-pixel);
		font-size: 1rem;
		color: white;
		text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
		border-radius: 2px;
		font-weight: bold;
	}

	.slot--sm .slot__fallback { font-size: 0.7rem; }
	.slot--lg .slot__fallback { font-size: 1.4rem; }

	.slot__check {
		position: absolute;
		bottom: -4px;
		right: -4px;
		width: 18px;
		height: 18px;
		background: var(--mc-xp-green);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 2px 4px rgba(0,0,0,0.3);
	}

	.slot__check svg {
		width: 12px;
		height: 12px;
		color: var(--mc-black);
	}
</style>
