<script lang="ts">
	import type { World } from '$lib/types';
	import Button from '$lib/components/atoms/Button.svelte';
	import { worldStore, WORLD_ICONS } from '$lib/stores/worlds.svelte';

	interface Props {
		worlds: World[];
		activeWorldId: string | null;
		onSelect?: (id: string) => void;
		onCreate?: () => void;
	}

	let { worlds, activeWorldId, onSelect, onCreate }: Props = $props();

	let isOpen = $state(false);
	let showCreateModal = $state(false);
	let newWorldName = $state('');
	let newWorldIcon = $state('🌍');

	const activeWorld = $derived(worlds.find(w => w.id === activeWorldId));

	function handleSelect(id: string) {
		onSelect?.(id);
		isOpen = false;
	}

	function handleCreate() {
		if (newWorldName.trim()) {
			worldStore.createWorld(newWorldName.trim(), newWorldIcon);
			newWorldName = '';
			newWorldIcon = '🌍';
			showCreateModal = false;
		}
	}

	function handleClickOutside(e: MouseEvent) {
		const target = e.target as HTMLElement;
		if (!target.closest('.world-selector')) {
			isOpen = false;
		}
	}
</script>

<svelte:window onclick={handleClickOutside} />

<div class="world-selector">
	<button
		class="world-selector__trigger"
		onclick={() => isOpen = !isOpen}
		aria-expanded={isOpen}
	>
		{#if activeWorld}
			<span class="world-selector__icon">{activeWorld.icon}</span>
			<span class="world-selector__name">{activeWorld.name}</span>
		{:else}
			<span class="world-selector__name">Select World</span>
		{/if}
		<svg class="world-selector__chevron" class:open={isOpen} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
			<path d="m6 9 6 6 6-6"/>
		</svg>
	</button>

	{#if isOpen}
		<div class="world-selector__dropdown">
			<div class="world-selector__list">
				{#each worlds as world (world.id)}
					<button
						class="world-selector__item"
						class:active={world.id === activeWorldId}
						onclick={() => handleSelect(world.id)}
					>
						<span class="world-selector__item-icon">{world.icon}</span>
						<span class="world-selector__item-name">{world.name}</span>
						{#if world.id === activeWorldId}
							<svg class="world-selector__check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M20 6 9 17l-5-5"/>
							</svg>
						{/if}
					</button>
				{/each}
			</div>
			<div class="world-selector__actions">
				<Button variant="primary" size="sm" fullWidth onclick={() => { showCreateModal = true; isOpen = false; }}>
					+ New World
				</Button>
			</div>
		</div>
	{/if}
</div>

{#if showCreateModal}
	<div class="modal-overlay" onclick={() => showCreateModal = false}>
		<div class="modal" onclick={(e) => e.stopPropagation()}>
			<h3 class="modal__title">Create New World</h3>

			<div class="modal__field">
				<label class="modal__label">World Name</label>
				<input
					type="text"
					class="mc-input"
					placeholder="My Epic World"
					bind:value={newWorldName}
					onkeydown={(e) => e.key === 'Enter' && handleCreate()}
				/>
			</div>

			<div class="modal__field">
				<label class="modal__label">Icon</label>
				<div class="icon-grid">
					{#each WORLD_ICONS as icon}
						<button
							class="icon-option"
							class:selected={newWorldIcon === icon}
							onclick={() => newWorldIcon = icon}
						>
							{icon}
						</button>
					{/each}
				</div>
			</div>

			<div class="modal__actions">
				<Button variant="ghost" onclick={() => showCreateModal = false}>
					Cancel
				</Button>
				<Button variant="primary" onclick={handleCreate} disabled={!newWorldName.trim()}>
					Create World
				</Button>
			</div>
		</div>
	</div>
{/if}

<style>
	.world-selector {
		position: relative;
	}

	.world-selector__trigger {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		padding: var(--space-sm) var(--space-md);
		background: var(--mc-dark-gray);
		border: 2px solid var(--mc-gray);
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: all var(--transition-fast);
		min-width: 180px;
	}

	.world-selector__trigger:hover {
		border-color: var(--mc-light-gray);
	}

	.world-selector__icon {
		font-size: 1.25rem;
	}

	.world-selector__name {
		flex: 1;
		font-family: var(--font-body);
		font-weight: 600;
		color: #E8E8E8;
		text-align: left;
	}

	.world-selector__chevron {
		width: 18px;
		height: 18px;
		color: var(--mc-light-gray);
		transition: transform var(--transition-fast);
	}

	.world-selector__chevron.open {
		transform: rotate(180deg);
	}

	.world-selector__dropdown {
		position: absolute;
		top: calc(100% + 4px);
		left: 0;
		right: 0;
		background: var(--mc-dark-gray);
		border: 2px solid var(--mc-gray);
		border-radius: var(--radius-md);
		overflow: hidden;
		z-index: 100;
		animation: slideDown 0.15s ease-out;
	}

	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.world-selector__list {
		max-height: 200px;
		overflow-y: auto;
	}

	.world-selector__item {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		width: 100%;
		padding: var(--space-sm) var(--space-md);
		background: transparent;
		border: none;
		cursor: pointer;
		transition: background var(--transition-fast);
		text-align: left;
	}

	.world-selector__item:hover {
		background: rgba(255,255,255,0.05);
	}

	.world-selector__item.active {
		background: rgba(128, 255, 32, 0.1);
	}

	.world-selector__item-icon {
		font-size: 1.25rem;
	}

	.world-selector__item-name {
		flex: 1;
		font-family: var(--font-body);
		color: #E8E8E8;
	}

	.world-selector__check {
		width: 18px;
		height: 18px;
		color: var(--mc-xp-green);
	}

	.world-selector__actions {
		padding: var(--space-sm);
		border-top: 1px solid var(--mc-gray);
	}

	/* Modal Styles */
	.modal-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0,0,0,0.8);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: var(--space-md);
		animation: fadeIn 0.2s ease-out;
	}

	.modal {
		background: var(--mc-dark-gray);
		border: 2px solid var(--mc-gray);
		border-radius: var(--radius-lg);
		padding: var(--space-lg);
		width: 100%;
		max-width: 400px;
		animation: slideUp 0.2s ease-out;
	}

	.modal__title {
		font-family: var(--font-pixel);
		font-size: 1.5rem;
		color: #E8E8E8;
		margin-bottom: var(--space-lg);
		text-align: center;
	}

	.modal__field {
		margin-bottom: var(--space-md);
	}

	.modal__label {
		display: block;
		font-size: 0.875rem;
		color: var(--mc-stone);
		margin-bottom: var(--space-xs);
	}

	.icon-grid {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		gap: var(--space-xs);
	}

	.icon-option {
		aspect-ratio: 1;
		font-size: 1.5rem;
		background: var(--mc-black);
		border: 2px solid var(--mc-gray);
		border-radius: var(--radius-sm);
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.icon-option:hover {
		border-color: var(--mc-light-gray);
	}

	.icon-option.selected {
		border-color: var(--mc-xp-green);
		background: rgba(128, 255, 32, 0.1);
	}

	.modal__actions {
		display: flex;
		gap: var(--space-sm);
		justify-content: flex-end;
		margin-top: var(--space-lg);
	}
</style>
