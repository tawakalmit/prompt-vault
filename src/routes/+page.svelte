<script lang="ts">
	import { onMount } from 'svelte';
	import type { Prompt } from '$lib/types/database';

	let { data }: { data: { prompts: Prompt[]; session: unknown } } = $props();

	const PAGE_SIZE = 12;
	let visibleCount = $state(PAGE_SIZE);
	let sentinelEl: HTMLDivElement | undefined = $state();
	let masonryContainer: HTMLDivElement | undefined = $state();

	let promptsWithImages = $derived(data.prompts.filter((p) => p.image_url));
	let visiblePrompts = $derived(promptsWithImages.slice(0, visibleCount));
	let hasMore = $derived(visibleCount < promptsWithImages.length);

	function loadMore() {
		visibleCount += PAGE_SIZE;
	}

	function getColumns(): number {
		if (typeof window === 'undefined') return 2;
		if (window.innerWidth >= 1024) return 4;
		if (window.innerWidth >= 768) return 3;
		return 2;
	}

	function layoutMasonry() {
		if (!masonryContainer) return;

		const items = Array.from(masonryContainer.children) as HTMLElement[];
		if (items.length === 0) return;

		const cols = getColumns();
		const gap = window.innerWidth >= 1024 ? 16 : window.innerWidth >= 768 ? 12 : 8;
		const containerWidth = masonryContainer.clientWidth;
		const colWidth = (containerWidth - gap * (cols - 1)) / cols;
		const colHeights = new Array(cols).fill(0);

		for (const item of items) {
			// Find the shortest column
			const minHeight = Math.min(...colHeights);
			const colIndex = colHeights.indexOf(minHeight);

			const x = colIndex * (colWidth + gap);
			const y = colHeights[colIndex];

			item.style.position = 'absolute';
			item.style.left = `${x}px`;
			item.style.top = `${y}px`;
			item.style.width = `${colWidth}px`;

			colHeights[colIndex] += item.offsetHeight + gap;
		}

		const maxHeight = Math.max(...colHeights);
		masonryContainer.style.height = `${maxHeight}px`;
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

		// Layout masonry after images load
		$effect(() => {
			// Track visiblePrompts to re-layout when they change
			void visiblePrompts;

			// Wait for DOM update then layout
			requestAnimationFrame(() => {
				if (!masonryContainer) return;
				const images = masonryContainer.querySelectorAll('img');
				let loaded = 0;
				const total = images.length;

				if (total === 0) {
					layoutMasonry();
					return;
				}

				const checkDone = () => {
					loaded++;
					if (loaded >= total) layoutMasonry();
				};

				images.forEach((img) => {
					if (img.complete) {
						checkDone();
					} else {
						img.addEventListener('load', checkDone, { once: true });
						img.addEventListener('error', checkDone, { once: true });
					}
				});
			});
		});

		const handleResize = () => layoutMasonry();
		window.addEventListener('resize', handleResize);

		return () => {
			observer.disconnect();
			window.removeEventListener('resize', handleResize);
		};
	});
</script>

<div class="mx-auto px-2 md:px-4 py-4 md:py-8 min-h-dvh">
	{#if promptsWithImages.length === 0}
		<div class="text-center py-20">
			<p class="text-base-content/50 text-lg">Belum ada prompt yang tersimpan.</p>
		</div>
	{:else}
		<div bind:this={masonryContainer} class="relative w-full">
			{#each visiblePrompts as prompt}
				<a href="/prompt/{prompt.slug}" class="group block overflow-hidden rounded-lg">
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
