import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Prompt } from '$lib/types/database';

export const load: PageServerLoad = async ({ params, locals: { supabase } }) => {
	const { data: prompt, error: fetchError } = await supabase
		.from('prompts')
		.select('*')
		.eq('slug', params.slug)
		.single();

	if (fetchError || !prompt) {
		error(404, 'Prompt tidak ditemukan');
	}

	return { prompt: prompt as Prompt };
};
