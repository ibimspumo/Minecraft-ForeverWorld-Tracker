<script lang="ts">
	interface Props {
		checked?: boolean;
		disabled?: boolean;
		size?: 'sm' | 'md' | 'lg';
		onchange?: (checked: boolean) => void;
	}

	let { checked = false, disabled = false, size = 'md', onchange }: Props = $props();

	const sizeClasses = {
		sm: 'checkbox--sm',
		md: 'checkbox--md',
		lg: 'checkbox--lg'
	};

	function handleChange(e: Event) {
		const target = e.target as HTMLInputElement;
		onchange?.(target.checked);
	}
</script>

<input
	type="checkbox"
	class="checkbox {sizeClasses[size]}"
	{checked}
	{disabled}
	onchange={handleChange}
/>

<style>
	.checkbox {
		appearance: none;
		background: var(--mc-slot-bg);
		border: 2px solid;
		border-color: var(--mc-inventory-border-dark) var(--mc-inventory-border-light) var(--mc-inventory-border-light) var(--mc-inventory-border-dark);
		cursor: pointer;
		position: relative;
		flex-shrink: 0;
		transition: all var(--transition-fast);
	}

	.checkbox--sm { width: 18px; height: 18px; }
	.checkbox--md { width: 24px; height: 24px; }
	.checkbox--lg { width: 32px; height: 32px; }

	.checkbox:hover:not(:disabled) {
		background: var(--mc-slot-hover);
	}

	.checkbox:checked {
		background: var(--mc-xp-green);
		animation: checkPop 0.2s ease-out;
	}

	.checkbox:checked::after {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		border: solid var(--mc-black);
		border-width: 0 3px 3px 0;
		transform: translate(-50%, -60%) rotate(45deg);
	}

	.checkbox--sm:checked::after {
		width: 6px;
		height: 10px;
		border-width: 0 2px 2px 0;
	}

	.checkbox--md:checked::after {
		width: 8px;
		height: 12px;
	}

	.checkbox--lg:checked::after {
		width: 10px;
		height: 16px;
		border-width: 0 4px 4px 0;
	}

	.checkbox:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	@keyframes checkPop {
		0% { transform: scale(1); }
		50% { transform: scale(1.1); }
		100% { transform: scale(1); }
	}
</style>
