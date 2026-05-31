import type { PageServerLoad } from './$types';
import type { Prompt } from '$lib/types/database';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const { data: prompts, error } = await supabase
		.from('prompts')
		.select('*')
		.order('created_at', { ascending: false });

	if (error) {
		console.error('Error fetching prompts:', error);
		return { prompts: [] as Prompt[] };
	}

	return { prompts: (prompts ?? []) as Prompt[] };
};
