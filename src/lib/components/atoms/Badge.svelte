<script lang="ts">
	import type { Difficulty, Phase } from '$lib/types';

	interface Props {
		variant?: 'difficulty' | 'phase' | 'category' | 'custom';
		difficulty?: Difficulty;
		phase?: Phase;
		color?: string;
		size?: 'sm' | 'md';
		children?: import('svelte').Snippet;
	}

	let {
		variant = 'custom',
		difficulty,
		phase,
		color,
		size = 'md',
		children
	}: Props = $props();

	const difficultyColors: Record<Difficulty, string> = {
		easy: 'var(--diff-easy)',
		medium: 'var(--diff-medium)',
		hard: 'var(--diff-hard)',
		extreme: 'var(--diff-extreme)'
	};

	const phaseColors: Record<Phase, string> = {
		early_game: 'var(--phase-early)',
		mid_game: 'var(--phase-mid)',
		late_game: 'var(--phase-late)',
		post_game: 'var(--phase-post)',
		any: 'var(--phase-any)'
	};

	const difficultyLabels: Record<Difficulty, string> = {
		easy: 'Easy',
		medium: 'Medium',
		hard: 'Hard',
		extreme: 'Extreme'
	};

	const phaseLabels: Record<Phase, string> = {
		early_game: 'Early',
		mid_game: 'Mid',
		late_game: 'Late',
		post_game: 'Post',
		any: 'Any'
	};

	const bgColor = $derived(() => {
		if (variant === 'difficulty' && difficulty) return difficultyColors[difficulty];
		if (variant === 'phase' && phase) return phaseColors[phase];
		return color ?? 'var(--mc-gray)';
	});

	const textColor = $derived(() => {
		if (variant === 'difficulty' && difficulty) {
			return difficulty === 'hard' || difficulty === 'extreme' ? '#fff' : '#000';
		}
		if (variant === 'phase' && phase) {
			return phase === 'late_game' || phase === 'post_game' ? '#fff' : '#000';
		}
		return '#fff';
	});

	const label = $derived(() => {
		if (variant === 'difficulty' && difficulty) return difficultyLabels[difficulty];
		if (variant === 'phase' && phase) return phaseLabels[phase];
		return null;
	});
</script>

<span
	class="badge badge--{size}"
	style="--bg-color: {bgColor()}; --text-color: {textColor()}"
>
	{#if label()}
		{label()}
	{:else if children}
		{@render children()}
	{/if}
</span>

<style>
	.badge {
		font-family: var(--font-pixel);
		padding: 2px 8px;
		border-radius: var(--radius-sm);
		text-transform: uppercase;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 4px;
		background: var(--bg-color);
		color: var(--text-color);
		white-space: nowrap;
		line-height: 1.2;
	}

	.badge--sm {
		font-size: 0.7rem;
		padding: 1px 6px;
	}

	.badge--md {
		font-size: 0.8rem;
		padding: 2px 8px;
	}
</style>
