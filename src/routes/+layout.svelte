<script lang="ts">
	import '../app.css';
	import { invalidate } from '$app/navigation';
	import { page } from '$app/state';
	import { onMount } from 'svelte';

	let { data, children } = $props();

	let navbarVisible = $state(true);
	let lastScrollY = 0;

	onMount(() => {
		const { data: { subscription } } = data.supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== data.session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		function handleScroll() {
			const currentY = window.scrollY;
			if (currentY < 10) {
				navbarVisible = true;
			} else if (currentY > lastScrollY) {
				navbarVisible = false;
			} else {
				navbarVisible = true;
			}
			lastScrollY = currentY;
		}

		window.addEventListener('scroll', handleScroll, { passive: true });

		return () => {
			subscription.unsubscribe();
			window.removeEventListener('scroll', handleScroll);
		};
	});
</script>

<div class="min-h-screen bg-base-100">
	<!-- Navbar -->
	<div
		class="navbar bg-base-200 shadow-sm fixed top-0 left-0 right-0 z-50 transition-transform duration-300"
		class:translate-y-0={navbarVisible}
		class:-translate-y-full={!navbarVisible}
	>
		<div class="flex-1">
			<a href="/" class="btn btn-ghost text-xl font-bold text-primary gap-2" style="font-family: 'Space Grotesk', sans-serif;">
				<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
				</svg>
				Prompt Vault
			</a>
		</div>
		<div class="flex items-center gap-2">
			{#if data.session}
				{#if !page.url.pathname.startsWith('/dashboard')}
					<a href="/dashboard" class="btn btn-sm btn-outline btn-primary">Dashboard</a>
				{/if}
				<form method="POST" action="/auth/logout">
					<button type="submit" class="btn btn-sm btn-ghost">Logout</button>
				</form>
			{:else}
				<a href="/login" class="btn btn-sm btn-primary">Login</a>
			{/if}
		</div>
	</div>

	<!-- Content -->
	<div class="pt-16">
		{@render children()}
	</div>

	<!-- Footer -->
	<footer class="py-6 text-center text-sm text-base-content/50 bg-base-200">
		<p class="flex items-center justify-center gap-2">
			Prompt Vault by 
			<a
				href="https://tawakalmit.my.id"
				target="_blank"
				rel="noopener noreferrer"
				style="color: #f1c40f; font-family: 'PixelBold', cursive;"
				class="hover:underline text-xs flex items-center gap-1"
			>
				<img src="/icon/tawakalmit-logo.png" alt="tawakalmit logo" class="w-5 h-5" />
				tawakalmit
			</a>
		</p>
	</footer>
</div>
