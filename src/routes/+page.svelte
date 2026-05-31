<script lang="ts">
	import type { Prompt } from '$lib/types/database';

	let { data }: { data: { prompts: Prompt[]; session: unknown } } = $props();

	const PAGE_SIZE = 6;
	let visibleCount = $state(PAGE_SIZE);

	let visiblePrompts = $derived(data.prompts.slice(0, visibleCount));
	let hasMore = $derived(visibleCount < data.prompts.length);

	function loadMore() {
		visibleCount += PAGE_SIZE;
	}
</script>

<div class="mx-auto px-4 py-8 min-h-dvh">
	<!-- Prompt Cards Grid -->
	{#if data.prompts.length === 0}
		<div class="text-center py-20">
			<p class="text-base-content/50 text-lg">Belum ada prompt yang tersimpan.</p>
		</div>
	{:else}
		<div class="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
			{#each visiblePrompts as prompt}
				<a
					href="/prompt/{prompt.slug}"
					class="card bg-base-200 shadow-md hover:shadow-lg transition-shadow"
				>
					{#if prompt.image_url}
						<figure>
							<img
								src={prompt.image_url}
								alt={prompt.title}
								class="w-full h-auto aspect-3/2 object-cover"
							/>
						</figure>
					{/if}
					<div class="card-body p-3 md:p-6">
						<h2 class="card-title text-sm md:text-base text-primary">{prompt.title}</h2>
						<p class="text-base-content/70 line-clamp-4 text-xs md:text-sm">{prompt.prompt}</p>
						<div class="card-actions justify-between items-center mt-2 md:mt-3">
							<div class="badge badge-outline badge-primary badge-xs md:badge-sm">{prompt.category}</div>
							<span class="text-[10px] md:text-xs text-base-content/50">
								{new Date(prompt.created_at).toLocaleDateString('id-ID')}
							</span>
						</div>
					</div>
				</a>
			{/each}
		</div>

		{#if hasMore}
			<div class="text-center mt-8">
				<button type="button" class="btn btn-outline btn-primary" onclick={loadMore}>
					Load More
				</button>
			</div>
		{/if}
	{/if}
</div>
