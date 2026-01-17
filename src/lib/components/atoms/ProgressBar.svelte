<script lang="ts">
	interface Props {
		value: number;
		max?: number;
		showLabel?: boolean;
		size?: 'sm' | 'md' | 'lg';
		color?: 'xp' | 'diamond' | 'gold' | 'emerald' | 'redstone';
		animated?: boolean;
	}

	let {
		value,
		max = 100,
		showLabel = false,
		size = 'md',
		color = 'xp',
		animated = true
	}: Props = $props();

	const percentage = $derived(Math.min(100, Math.max(0, (value / max) * 100)));

	const sizeClasses = {
		sm: 'progress--sm',
		md: 'progress--md',
		lg: 'progress--lg'
	};

	const colorClasses = {
		xp: 'progress--xp',
		diamond: 'progress--diamond',
		gold: 'progress--gold',
		emerald: 'progress--emerald',
		redstone: 'progress--redstone'
	};
</script>

<div class="progress-wrapper">
	<div class="progress {sizeClasses[size]} {colorClasses[color]}">
		<div
			class="progress__bar"
			class:progress__bar--animated={animated}
			style="width: {percentage}%"
		>
			{#if percentage > 0}
				<div class="progress__shine"></div>
			{/if}
		</div>
	</div>
	{#if showLabel}
		<span class="progress__label">{Math.round(percentage)}%</span>
	{/if}
</div>

<style>
	.progress-wrapper {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		width: 100%;
	}

	.progress {
		flex: 1;
		background: var(--mc-black);
		border: 2px solid var(--mc-gray);
		border-radius: var(--radius-sm);
		overflow: hidden;
		position: relative;
	}

	.progress--sm { height: 6px; }
	.progress--md { height: 10px; }
	.progress--lg { height: 16px; }

	.progress__bar {
		height: 100%;
		position: relative;
		transition: width var(--transition-normal) ease-out;
		overflow: hidden;
	}

	.progress__bar--animated {
		transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
	}

	/* Color variants */
	.progress--xp .progress__bar {
		background: linear-gradient(180deg, var(--mc-xp-green) 0%, var(--mc-xp-green-dark) 100%);
		box-shadow: 0 0 8px var(--mc-xp-green);
	}

	.progress--diamond .progress__bar {
		background: linear-gradient(180deg, #7FFFFF 0%, var(--mc-diamond) 100%);
		box-shadow: 0 0 8px var(--mc-diamond);
	}

	.progress--gold .progress__bar {
		background: linear-gradient(180deg, #FFE566 0%, var(--mc-gold) 100%);
		box-shadow: 0 0 8px var(--mc-gold);
	}

	.progress--emerald .progress__bar {
		background: linear-gradient(180deg, #5FFF9F 0%, var(--mc-emerald) 100%);
		box-shadow: 0 0 8px var(--mc-emerald);
	}

	.progress--redstone .progress__bar {
		background: linear-gradient(180deg, #FF6666 0%, var(--mc-redstone) 100%);
		box-shadow: 0 0 8px var(--mc-redstone);
	}

	.progress__shine {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 50%;
		background: linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 100%);
	}

	.progress__label {
		font-family: var(--font-pixel);
		font-size: 0.875rem;
		color: var(--mc-stone);
		min-width: 3ch;
		text-align: right;
	}

	.progress--lg + .progress__label {
		font-size: 1rem;
	}
</style>
