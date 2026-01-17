<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Category } from '$lib/types';
	import Header from '$lib/components/organisms/Header.svelte';
	import Sidebar from '$lib/components/organisms/Sidebar.svelte';
	import { worldStore } from '$lib/stores/worlds.svelte';

	interface Props {
		children: Snippet;
		selectedCategory?: Category | null;
		onCategorySelect?: (category: Category | null) => void;
	}

	let { children, selectedCategory = null, onCategorySelect }: Props = $props();

	let sidebarOpen = $state(false);
	let importInput: HTMLInputElement;

	function handleExport() {
		const data = worldStore.exportProgress();
		const blob = new Blob([data], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `minecraft-tracker-${new Date().toISOString().split('T')[0]}.json`;
		a.click();
		URL.revokeObjectURL(url);
	}

	function handleImport() {
		importInput?.click();
	}

	function handleFileSelect(e: Event) {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (e) => {
			const content = e.target?.result as string;
			if (worldStore.importProgress(content)) {
				alert('Progress imported successfully!');
			} else {
				alert('Failed to import progress. Invalid file format.');
			}
		};
		reader.readAsText(file);
	}
</script>

<div class="layout">
	<Header
		onMenuClick={() => sidebarOpen = !sidebarOpen}
		onExport={handleExport}
		onImport={handleImport}
	/>

	<Sidebar
		isOpen={sidebarOpen}
		onClose={() => sidebarOpen = false}
		{selectedCategory}
		{onCategorySelect}
	/>

	<main class="layout__main">
		<div class="layout__content">
			{@render children()}
		</div>
	</main>

	<input
		bind:this={importInput}
		type="file"
		accept=".json"
		onchange={handleFileSelect}
		style="display: none;"
	/>
</div>

<style>
	.layout {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	.layout__main {
		flex: 1;
		margin-left: var(--sidebar-width);
		padding: var(--space-lg);
		transition: margin-left var(--transition-normal);
	}

	.layout__content {
		max-width: var(--max-content-width);
		margin: 0 auto;
	}

	@media (max-width: 768px) {
		.layout__main {
			margin-left: 0;
			padding: var(--space-md);
		}
	}
</style>
