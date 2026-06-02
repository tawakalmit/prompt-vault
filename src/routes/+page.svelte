<script lang="ts">
	import { onMount } from 'svelte';
	import type { Prompt } from '$lib/types/database';

	let { data }: { data: { prompts: Prompt[]; session: unknown } } = $props();

	const PAGE_SIZE = 12;
	let visibleCount = $state(PAGE_SIZE);
	let sentinelEl: HTMLDivElement | undefined = $state();

	let promptsWithImages = $derived(data.prompts.filter((p) => p.image_url));
	let visiblePrompts = $derived(promptsWithImages.slice(0, visibleCount));
	let hasMore = $derived(visibleCount < promptsWithImages.length);

	function loadMore() {
		visibleCount += PAGE_SIZE;
	}

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasMore) {
					loadMore();
				}
			},
			{ rootMargin: '200px' }
		);

		$effect(() => {
			if (sentinelEl) {
				observer.observe(sentinelEl);
			}
			return () => {
				if (sentinelEl) observer.unobserve(sentinelEl);
			};
		});

		return () => observer.disconnect();
	});
</script>

<div class="mx-auto px-2 md:px-4 py-4 md:py-8 min-h-dvh">
	{#if promptsWithImages.length === 0}
		<div class="text-center py-20">
			<p class="text-base-content/50 text-lg">Belum ada prompt yang tersimpan.</p>
		</div>
	{:else}
		<div class="masonry-grid">
			{#each visiblePrompts as prompt}
				<a href="/prompt/{prompt.slug}" class="masonry-item group">
					<img
						src={prompt.image_url}
						alt={prompt.title}
						class="w-full h-auto rounded-lg object-cover transition-transform duration-200 group-hover:scale-[1.02] group-hover:shadow-xl"
						loading="lazy"
					/>
				</a>
			{/each}
		</div>

		{#if hasMore}
			<div bind:this={sentinelEl} class="w-full h-10"></div>
		{/if}
	{/if}
</div>

<style>
	.masonry-grid {
		columns: 2;
		column-gap: 0.5rem;
	}

	.masonry-item {
		display: block;
		margin-bottom: 0.5rem;
		break-inside: avoid;
		border-radius: 0.5rem;
		overflow: hidden;
	}

	@media (min-width: 768px) {
		.masonry-grid {
			columns: 3;
			column-gap: 0.75rem;
		}

		.masonry-item {
			margin-bottom: 0.75rem;
		}
	}

	@media (min-width: 1024px) {
		.masonry-grid {
			columns: 4;
			column-gap: 1rem;
		}

		.masonry-item {
			margin-bottom: 1rem;
		}
	}
</style>
