<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'default' | 'primary' | 'danger' | 'ghost';
		size?: 'sm' | 'md' | 'lg';
		disabled?: boolean;
		fullWidth?: boolean;
		onclick?: () => void;
		children: Snippet;
	}

	let {
		variant = 'default',
		size = 'md',
		disabled = false,
		fullWidth = false,
		onclick,
		children
	}: Props = $props();
</script>

<button
	class="btn btn--{variant} btn--{size}"
	class:btn--full={fullWidth}
	{disabled}
	{onclick}
>
	{@render children()}
</button>

<style>
	.btn {
		font-family: var(--font-pixel);
		border: none;
		cursor: pointer;
		position: relative;
		text-transform: uppercase;
		letter-spacing: 1px;
		transition: all var(--transition-fast);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-sm);
	}

	.btn--sm {
		font-size: 0.875rem;
		padding: var(--space-xs) var(--space-sm);
	}

	.btn--md {
		font-size: 1rem;
		padding: var(--space-sm) var(--space-md);
	}

	.btn--lg {
		font-size: 1.125rem;
		padding: var(--space-md) var(--space-lg);
	}

	.btn--full {
		width: 100%;
	}

	/* Default variant */
	.btn--default {
		background: var(--mc-gray);
		color: #E8E8E8;
		box-shadow:
			inset -2px -4px 0 rgba(0,0,0,0.4),
			inset 2px 2px 0 rgba(255,255,255,0.2);
	}

	.btn--default:hover:not(:disabled) {
		background: var(--mc-light-gray);
		box-shadow:
			inset -2px -4px 0 rgba(0,0,0,0.3),
			inset 2px 2px 0 rgba(255,255,255,0.3);
	}

	.btn--default:active:not(:disabled) {
		box-shadow:
			inset 2px 4px 0 rgba(0,0,0,0.4),
			inset -2px -2px 0 rgba(255,255,255,0.1);
	}

	/* Primary variant */
	.btn--primary {
		background: var(--mc-xp-green-dark);
		color: var(--mc-black);
		box-shadow:
			inset -2px -4px 0 rgba(0,0,0,0.3),
			inset 2px 2px 0 rgba(255,255,255,0.3);
	}

	.btn--primary:hover:not(:disabled) {
		background: var(--mc-xp-green);
	}

	/* Danger variant */
	.btn--danger {
		background: #c0392b;
		color: #fff;
		box-shadow:
			inset -2px -4px 0 rgba(0,0,0,0.3),
			inset 2px 2px 0 rgba(255,255,255,0.2);
	}

	.btn--danger:hover:not(:disabled) {
		background: #e74c3c;
	}

	/* Ghost variant */
	.btn--ghost {
		background: transparent;
		color: #E8E8E8;
		box-shadow: none;
	}

	.btn--ghost:hover:not(:disabled) {
		background: rgba(255,255,255,0.1);
	}

	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
