import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { Prompt, PromptUpdate } from '$lib/types/database';

function generateSlug(title: string): string {
	return title
		.toLowerCase()
		.replace(/[^a-z0-9\s-]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
		.trim() + '-' + Date.now().toString(36);
}

export const load: PageServerLoad = async ({ locals: { supabase, user } }) => {
	if (!user) redirect(303, '/login');

	const { data: prompts, error } = await supabase
		.from('prompts')
		.select('*')
		.eq('user_id', user.id)
		.order('created_at', { ascending: false });

	if (error) {
		console.error('Error fetching prompts:', error);
		return { prompts: [] as Prompt[] };
	}

	return { prompts: (prompts ?? []) as Prompt[] };
};

export const actions: Actions = {
	create: async ({ request, locals: { supabase, user } }) => {
		if (!user) return fail(401, { message: 'Unauthorized' });

		const formData = await request.formData();
		const title = formData.get('title') as string;
		const prompt = formData.get('prompt') as string;
		const category = formData.get('category') as string;
		const imageFile = formData.get('image') as File | null;

		if (!title || !prompt || !category) {
			return fail(400, { message: 'Title, prompt, dan kategori wajib diisi' });
		}

		let image_url: string | null = null;

		if (imageFile && imageFile.size > 0) {
			const fileExt = imageFile.name.split('.').pop();
			const fileName = `${user.id}/${Date.now()}.${fileExt}`;

			const { error: uploadError } = await supabase.storage
				.from('prompt-images')
				.upload(fileName, imageFile, {
					cacheControl: '3600',
					upsert: false
				});

			if (uploadError) {
				return fail(500, { message: 'Gagal upload gambar: ' + uploadError.message });
			}

			const { data: publicUrl } = supabase.storage
				.from('prompt-images')
				.getPublicUrl(fileName);

			image_url = publicUrl.publicUrl;
		}

		const { error } = await supabase.from('prompts').insert({
			title,
			slug: generateSlug(title),
			prompt,
			category,
			image_url,
			user_id: user.id,
			created_by: user.user_metadata?.full_name ?? user.email ?? user.id
		});

		if (error) {
			return fail(500, { message: 'Gagal menyimpan prompt: ' + error.message });
		}

		return { success: true };
	},

	update: async ({ request, locals: { supabase, user } }) => {
		if (!user) return fail(401, { message: 'Unauthorized' });

		const formData = await request.formData();
		const id = formData.get('id') as string;
		const title = formData.get('title') as string;
		const prompt = formData.get('prompt') as string;
		const category = formData.get('category') as string;
		const imageFile = formData.get('image') as File | null;

		if (!id || !title || !prompt || !category) {
			return fail(400, { message: 'Semua field wajib diisi' });
		}

		const updateData: PromptUpdate = {
			title,
			prompt,
			category,
			updated_at: new Date().toISOString()
		};

		if (imageFile && imageFile.size > 0) {
			const fileExt = imageFile.name.split('.').pop();
			const fileName = `${user.id}/${Date.now()}.${fileExt}`;

			const { error: uploadError } = await supabase.storage
				.from('prompt-images')
				.upload(fileName, imageFile, {
					cacheControl: '3600',
					upsert: false
				});

			if (uploadError) {
				return fail(500, { message: 'Gagal upload gambar: ' + uploadError.message });
			}

			const { data: publicUrl } = supabase.storage
				.from('prompt-images')
				.getPublicUrl(fileName);

			updateData.image_url = publicUrl.publicUrl;
		}

		const { error } = await supabase
			.from('prompts')
			.update(updateData)
			.eq('id', id)
			.eq('user_id', user.id);

		if (error) {
			return fail(500, { message: 'Gagal update prompt: ' + error.message });
		}

		return { success: true };
	},

	delete: async ({ request, locals: { supabase, user } }) => {
		if (!user) return fail(401, { message: 'Unauthorized' });

		const formData = await request.formData();
		const id = formData.get('id') as string;

		if (!id) {
			return fail(400, { message: 'ID wajib diisi' });
		}

		const { error } = await supabase
			.from('prompts')
			.delete()
			.eq('id', id)
			.eq('user_id', user.id);

		if (error) {
			return fail(500, { message: 'Gagal menghapus prompt: ' + error.message });
		}

		return { success: true };
	}
};
