<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Prompt } from '$lib/types/database';
	import type { PageData } from './$types';

	let { data, form }: { data: PageData & { prompts: Prompt[] }; form: { message?: string } | null } = $props();

	let showForm = $state(false);
	let editingPrompt = $state<Prompt | null>(null);

	const categories = ['Coding', 'Video', 'Image', 'Filter'];

	const PAGE_SIZE = 6;
	let visibleCount = $state(PAGE_SIZE);

	let visiblePrompts = $derived(data.prompts.slice(0, visibleCount));
	let hasMore = $derived(visibleCount < data.prompts.length);

	function loadMore() {
		visibleCount += PAGE_SIZE;
	}

	function openCreate() {
		editingPrompt = null;
		showForm = true;
	}

	function openEdit(prompt: Prompt) {
		editingPrompt = prompt;
		showForm = true;
	}

	function closeForm() {
		showForm = false;
		editingPrompt = null;
	}
</script>

<div class="mx-auto px-4 py-8">
	<!-- Header -->
	<div class="flex items-center justify-between mb-8">
		<div>
			<p class="text-base-content/60 text-sm mt-1">Halo, {data.user?.email}</p>
		</div>
		<button onclick={openCreate} class="btn btn-primary">
			+ Buat Prompt
		</button>
	</div>

	<!-- Error message -->
	{#if form?.message}
		<div class="alert alert-error mb-6">
			<span>{form.message}</span>
		</div>
	{/if}

	<!-- Modal Form -->
	{#if showForm}
		<div class="modal modal-open">
			<div class="modal-box bg-base-200">
				<h3 class="font-bold text-lg text-primary mb-4">
					{editingPrompt ? 'Edit Prompt' : 'Buat Prompt Baru'}
				</h3>

				<form
					method="POST"
					action={editingPrompt ? '?/update' : '?/create'}
					enctype="multipart/form-data"
					use:enhance={() => {
						return async ({ update }) => {
							await update();
							closeForm();
						};
					}}
				>
					{#if editingPrompt}
						<input type="hidden" name="id" value={editingPrompt.id} />
					{/if}

					<div class="space-y-4">
						<div class="form-control">
							<label for="title" class="label">
								<span class="label-text">Judul Prompt</span>
							</label>
							<input
								type="text"
								id="title"
								name="title"
								value={editingPrompt?.title ?? ''}
								required
								class="input input-bordered w-full"
								placeholder="Contoh: Email Marketing Generator"
							/>
						</div>

						<div class="form-control">
							<label for="prompt" class="label">
								<span class="label-text">Prompt</span>
							</label>
							<textarea
								id="prompt"
								name="prompt"
								required
								rows="5"
								class="textarea textarea-bordered w-full"
								placeholder="Tulis prompt kamu di sini..."
							>{editingPrompt?.prompt ?? ''}</textarea>
						</div>

						<div class="form-control">
							<label for="category" class="label">
								<span class="label-text">Kategori</span>
							</label>
							<select
								id="category"
								name="category"
								required
								class="select select-bordered w-full"
							>
								<option value="" disabled selected={!editingPrompt}>Pilih kategori</option>
								{#each categories as cat}
									<option value={cat} selected={editingPrompt?.category === cat}>{cat}</option>
								{/each}
							</select>
						</div>

						<div class="form-control">
							<label for="image" class="label">
								<span class="label-text">Gambar (opsional)</span>
							</label>
							<input
								type="file"
								id="image"
								name="image"
								accept="image/*"
								class="file-input file-input-bordered w-full"
							/>
							{#if editingPrompt?.image_url}
								<p class="text-xs text-base-content/50 mt-1">Sudah ada gambar. Upload baru untuk mengganti.</p>
							{/if}
						</div>
					</div>

					<div class="modal-action">
						<button type="submit" class="btn btn-primary">
							{editingPrompt ? 'Update' : 'Simpan'}
						</button>
						<button type="button" onclick={closeForm} class="btn btn-ghost">
							Batal
						</button>
					</div>
				</form>
			</div>
			<button type="button" class="modal-backdrop" onclick={closeForm}>close</button>
		</div>
	{/if}

	<!-- Prompt Cards -->
	{#if data.prompts.length === 0}
		<div class="text-center py-20">
			<p class="text-base-content/50 text-lg">Belum ada prompt. Buat prompt pertamamu!</p>
		</div>
	{:else}
		<div class="grid grid-cols-2 lg:grid-cols-3 gap-6">
			{#each visiblePrompts as prompt}
				<div class="card bg-base-200 shadow-md">
					{#if prompt.image_url}
						<figure>
							<img
								src={prompt.image_url}
								alt={prompt.title}
								class="w-full h-auto aspect-3/2 object-cover"
							/>
						</figure>
					{/if}
					<div class="card-body">
						<h2 class="card-title text-primary">{prompt.title}</h2>
						<p class="text-base-content/70 line-clamp-4">{prompt.prompt}</p>

						<div class="flex items-center justify-between mt-2">
							<div class="badge badge-outline badge-primary badge-sm">{prompt.category}</div>
							<span class="text-xs text-base-content/50">
								{new Date(prompt.created_at).toLocaleDateString('id-ID')}
							</span>
						</div>

						<div class="card-actions justify-end mt-3">
							<button
								onclick={() => openEdit(prompt)}
								class="btn btn-sm btn-outline btn-primary"
							>
								Edit
							</button>
							<form
								method="POST"
								action="?/delete"
								use:enhance={() => {
									return async ({ update }) => {
										await update();
									};
								}}
							>
								<input type="hidden" name="id" value={prompt.id} />
								<button type="submit" class="btn btn-sm btn-outline btn-error">
									Hapus
								</button>
							</form>
						</div>
					</div>
				</div>
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
