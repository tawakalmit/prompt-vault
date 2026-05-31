# Prompt Vault

Website untuk menyimpan dan mengelola prompt AI. Dibangun dengan SvelteKit, Tailwind CSS, dan Supabase.

## Fitur

- Login dengan Google SSO
- Dashboard CRUD prompt
- Field: Title, Prompt, Kategori, Image
- Data tersimpan per-user (created_by)
- Row Level Security (RLS) — user hanya bisa akses data sendiri

## Tech Stack

- **Frontend**: SvelteKit 2 + Svelte 5
- **Styling**: Tailwind CSS 4
- **Backend/DB**: Supabase (PostgreSQL + Auth + Storage)

## Setup

### 1. Supabase

1. Buat project baru di [supabase.com](https://supabase.com)
2. Jalankan SQL di `supabase/schema.sql` pada SQL Editor di Supabase Dashboard
3. Setup Google OAuth:
   - Buka **Authentication > Providers > Google**
   - Masukkan Client ID dan Client Secret dari Google Cloud Console
   - Set redirect URL: `https://<your-project>.supabase.co/auth/v1/callback`
4. Copy **Project URL** dan **anon key** dari **Settings > API**

### 2. Environment Variables

Copy `.env.example` ke `.env` dan isi:

```env
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Install & Run

```bash
npm install
npm run dev
```

Buka `http://localhost:5173`

## Struktur Project

```
src/
├── lib/
│   ├── supabase.ts          # Supabase client helpers
│   └── types/
│       └── database.ts      # TypeScript types
├── routes/
│   ├── +layout.svelte       # Root layout
│   ├── +layout.ts           # Client-side auth
│   ├── +layout.server.ts    # Server-side auth
│   ├── +page.svelte         # Landing page
│   ├── login/
│   │   └── +page.svelte     # Login page
│   ├── auth/
│   │   ├── callback/+server.ts  # OAuth callback
│   │   └── logout/+server.ts    # Logout handler
│   └── dashboard/
│       ├── +page.server.ts  # CRUD actions
│       └── +page.svelte     # Dashboard UI
├── hooks.server.ts          # Auth middleware
├── app.css                  # Tailwind imports
└── app.d.ts                 # Type declarations
```
# prompt-vault
