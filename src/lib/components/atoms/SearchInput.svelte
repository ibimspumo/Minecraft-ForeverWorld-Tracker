<script lang="ts">
	interface Props {
		value?: string;
		placeholder?: string;
		oninput?: (value: string) => void;
		onclear?: () => void;
	}

	let {
		value = '',
		placeholder = 'Search...',
		oninput,
		onclear
	}: Props = $props();

	let inputRef: HTMLInputElement;

	function handleInput(e: Event) {
		const target = e.target as HTMLInputElement;
		oninput?.(target.value);
	}

	function handleClear() {
		oninput?.('');
		onclear?.();
		inputRef?.focus();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && value) {
			handleClear();
		}
	}
</script>

<div class="search">
	<svg class="search__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
		<circle cx="11" cy="11" r="8"/>
		<path d="m21 21-4.35-4.35"/>
	</svg>
	<input
		bind:this={inputRef}
		type="text"
		class="search__input"
		{value}
		{placeholder}
		oninput={handleInput}
		onkeydown={handleKeydown}
	/>
	{#if value}
		<button class="search__clear" onclick={handleClear} aria-label="Clear search">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M18 6 6 18M6 6l12 12"/>
			</svg>
		</button>
	{/if}
</div>

<style>
	.search {
		position: relative;
		width: 100%;
	}

	.search__icon {
		position: absolute;
		left: var(--space-sm);
		top: 50%;
		transform: translateY(-50%);
		width: 18px;
		height: 18px;
		color: var(--mc-light-gray);
		pointer-events: none;
	}

	.search__input {
		width: 100%;
		font-family: var(--font-body);
		font-size: 1rem;
		padding: var(--space-sm) var(--space-md);
		padding-left: 36px;
		padding-right: 36px;
		background: var(--mc-black);
		border: 2px solid var(--mc-gray);
		color: #E8E8E8;
		border-radius: var(--radius-sm);
		transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
	}

	.search__input:focus {
		outline: none;
		border-color: var(--mc-xp-green);
		box-shadow: 0 0 0 2px rgba(128, 255, 32, 0.2);
	}

	.search__input::placeholder {
		color: var(--mc-light-gray);
	}

	.search__clear {
		position: absolute;
		right: var(--space-xs);
		top: 50%;
		transform: translateY(-50%);
		width: 28px;
		height: 28px;
		padding: 4px;
		background: transparent;
		border: none;
		color: var(--mc-light-gray);
		cursor: pointer;
		border-radius: var(--radius-sm);
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all var(--transition-fast);
	}

	.search__clear:hover {
		background: rgba(255,255,255,0.1);
		color: #E8E8E8;
	}

	.search__clear svg {
		width: 16px;
		height: 16px;
	}
</style>
