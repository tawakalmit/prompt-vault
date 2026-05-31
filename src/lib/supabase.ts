import { createBrowserClient, createServerClient, isBrowser } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { Database } from '$lib/types/database';

export function createSupabaseLoadClient(fetch: typeof globalThis.fetch) {
	return createBrowserClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		global: { fetch }
	});
}

export function createSupabaseServerClient(
	fetch: typeof globalThis.fetch,
	cookies: {
		getAll: () => { name: string; value: string }[];
		setAll: (cookies: { name: string; value: string; options: Record<string, unknown> }[]) => void;
	}
) {
	return createServerClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		global: { fetch },
		cookies
	});
}
