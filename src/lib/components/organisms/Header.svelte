<script lang="ts">
	import WorldSelector from '$lib/components/molecules/WorldSelector.svelte';
	import Button from '$lib/components/atoms/Button.svelte';
	import { worldStore } from '$lib/stores/worlds.svelte';

	interface Props {
		onMenuClick?: () => void;
		onExport?: () => void;
		onImport?: () => void;
	}

	let { onMenuClick, onExport, onImport }: Props = $props();

	let showMenu = $state(false);
</script>

<header class="header">
	<div class="header__left">
		<button class="header__menu-btn" onclick={onMenuClick} aria-label="Toggle menu">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M3 12h18M3 6h18M3 18h18"/>
			</svg>
		</button>

		<div class="header__brand">
			<span class="header__logo">⛏️</span>
			<div class="header__titles">
				<h1 class="header__title">Forever World</h1>
				<span class="header__subtitle">Tracker</span>
			</div>
		</div>
	</div>

	<div class="header__center">
		<WorldSelector
			worlds={worldStore.worlds}
			activeWorldId={worldStore.activeWorldId}
			onSelect={(id) => worldStore.setActiveWorld(id)}
		/>
	</div>

	<div class="header__right">
		<div class="header__actions">
			<button
				class="header__action-btn"
				onclick={() => showMenu = !showMenu}
				aria-label="More options"
			>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<circle cx="12" cy="12" r="1"/>
					<circle cx="12" cy="5" r="1"/>
					<circle cx="12" cy="19" r="1"/>
				</svg>
			</button>

			{#if showMenu}
				<div class="header__dropdown">
					<button class="header__dropdown-item" onclick={() => { onExport?.(); showMenu = false; }}>
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
						</svg>
						Export Progress
					</button>
					<button class="header__dropdown-item" onclick={() => { onImport?.(); showMenu = false; }}>
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
						</svg>
						Import Progress
					</button>
					<div class="header__dropdown-divider"></div>
					<button
						class="header__dropdown-item header__dropdown-item--danger"
						onclick={() => { worldStore.resetWorldProgress(); showMenu = false; }}
					>
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
						</svg>
						Reset Progress
					</button>
				</div>
			{/if}
		</div>
	</div>
</header>

{#if showMenu}
	<div class="header__overlay" onclick={() => showMenu = false}></div>
{/if}

<style>
	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-md);
		padding: var(--space-md) var(--space-lg);
		background: var(--mc-dark-gray);
		border-bottom: 2px solid var(--mc-gray);
		position: sticky;
		top: 0;
		z-index: 100;
		height: var(--header-height);
	}

	.header__left {
		display: flex;
		align-items: center;
		gap: var(--space-md);
	}

	.header__menu-btn {
		display: none;
		width: 40px;
		height: 40px;
		padding: 8px;
		background: transparent;
		border: 2px solid var(--mc-gray);
		border-radius: var(--radius-sm);
		color: #E8E8E8;
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.header__menu-btn:hover {
		border-color: var(--mc-xp-green);
		color: var(--mc-xp-green);
	}

	.header__menu-btn svg {
		width: 100%;
		height: 100%;
	}

	.header__brand {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
	}

	.header__logo {
		font-size: 2rem;
		animation: bounce 2s ease-in-out infinite;
	}

	@keyframes bounce {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(-3px); }
	}

	.header__titles {
		display: flex;
		flex-direction: column;
	}

	.header__title {
		font-family: var(--font-pixel);
		font-size: 1.5rem;
		color: var(--mc-xp-green);
		text-shadow: 2px 2px 0 var(--mc-black);
		line-height: 1;
		letter-spacing: 2px;
	}

	.header__subtitle {
		font-family: var(--font-pixel);
		font-size: 0.875rem;
		color: var(--mc-stone);
		text-transform: uppercase;
	}

	.header__center {
		flex: 1;
		display: flex;
		justify-content: center;
		max-width: 300px;
		margin: 0 auto;
	}

	.header__right {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
	}

	.header__actions {
		position: relative;
	}

	.header__action-btn {
		width: 40px;
		height: 40px;
		padding: 8px;
		background: transparent;
		border: 2px solid var(--mc-gray);
		border-radius: var(--radius-sm);
		color: #E8E8E8;
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.header__action-btn:hover {
		border-color: var(--mc-light-gray);
		background: rgba(255,255,255,0.05);
	}

	.header__action-btn svg {
		width: 100%;
		height: 100%;
	}

	.header__dropdown {
		position: absolute;
		top: calc(100% + 8px);
		right: 0;
		min-width: 200px;
		background: var(--mc-dark-gray);
		border: 2px solid var(--mc-gray);
		border-radius: var(--radius-md);
		overflow: hidden;
		z-index: 200;
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

	.header__dropdown-item {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		width: 100%;
		padding: var(--space-sm) var(--space-md);
		background: transparent;
		border: none;
		color: #E8E8E8;
		font-family: var(--font-body);
		font-size: 0.9rem;
		cursor: pointer;
		text-align: left;
		transition: background var(--transition-fast);
	}

	.header__dropdown-item:hover {
		background: rgba(255,255,255,0.05);
	}

	.header__dropdown-item svg {
		width: 18px;
		height: 18px;
		flex-shrink: 0;
	}

	.header__dropdown-item--danger {
		color: #e74c3c;
	}

	.header__dropdown-item--danger:hover {
		background: rgba(231, 76, 60, 0.1);
	}

	.header__dropdown-divider {
		height: 1px;
		background: var(--mc-gray);
		margin: var(--space-xs) 0;
	}

	.header__overlay {
		position: fixed;
		inset: 0;
		z-index: 99;
	}

	@media (max-width: 768px) {
		.header {
			padding: var(--space-sm) var(--space-md);
		}

		.header__menu-btn {
			display: flex;
		}

		.header__titles {
			display: none;
		}

		.header__center {
			display: none;
		}
	}
</style>
