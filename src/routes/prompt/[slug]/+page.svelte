<script lang="ts">
	import type { Prompt } from '$lib/types/database';

	let { data }: { data: { prompt: Prompt } } = $props();

	let copied = $state(false);
	let showFullImage = $state(false);

	async function copyPrompt() {
		await navigator.clipboard.writeText(data.prompt.prompt);
		copied = true;
		setTimeout(() => { copied = false; }, 2000);
	}
</script>

<div class="container mx-auto px-4 py-8 max-w-4xl">
	<!-- Back -->
	<a href="/" class="btn btn-ghost btn-sm mb-6">← Kembali</a>

	<!-- Image -->
	{#if data.prompt.image_url}
		<div class="relative mb-6">
			<img
				src={data.prompt.image_url}
				alt={data.prompt.title}
				class="w-full max-h-96 object-cover rounded-xl"
			/>
			<button
				type="button"
				class="btn btn-sm btn-circle bg-base-100/80 hover:bg-base-100 absolute bottom-3 right-3"
				onclick={() => showFullImage = true}
			>
				<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
				</svg>
			</button>
		</div>
	{/if}

	<!-- Title & Meta -->
	<div class="flex items-start justify-between gap-4 mb-2">
		<h1 class="text-2xl md:text-3xl font-bold text-primary">{data.prompt.title}</h1>
		<div class="badge badge-outline badge-primary shrink-0">{data.prompt.category}</div>
	</div>

	<p class="text-xs text-base-content/50 mb-6">
		Dibuat oleh {data.prompt.created_by} · {new Date(data.prompt.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
	</p>

	<!-- Prompt Content -->
	<div class="bg-base-200 rounded-xl p-5 md:p-8 relative">
		<button
			type="button"
			class="btn btn-sm btn-ghost absolute top-3 right-3 tooltip tooltip-left"
			data-tip={copied ? 'Tersalin!' : 'Copy prompt'}
			onclick={copyPrompt}
		>
			{#if copied}
				<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
				</svg>
			{:else}
				<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
				</svg>
			{/if}
		</button>

		<p class="text-base-content/80 whitespace-pre-wrap pr-10">{data.prompt.prompt}</p>
	</div>
</div>

<!-- Fullscreen Image Overlay -->
{#if showFullImage && data.prompt.image_url}
	<div class="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
		<button
			type="button"
			class="btn btn-sm btn-circle btn-ghost text-white absolute top-4 right-4"
			onclick={() => showFullImage = false}
		>✕</button>
		<img
			src={data.prompt.image_url}
			alt={data.prompt.title}
			class="max-w-full max-h-full object-contain"
		/>
	</div>
{/if}
