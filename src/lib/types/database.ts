export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
	public: {
		Tables: {
			prompts: {
				Row: {
					id: string;
					title: string;
					slug: string;
					prompt: string;
					category: string;
					image_url: string | null;
					user_id: string;
					created_by: string;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					title: string;
					slug: string;
					prompt: string;
					category: string;
					image_url?: string | null;
					user_id: string;
					created_by: string;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					title?: string;
					slug?: string;
					prompt?: string;
					category?: string;
					image_url?: string | null;
					user_id?: string;
					created_by?: string;
					created_at?: string;
					updated_at?: string;
				};
				Relationships: [];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
}

export type Prompt = Database['public']['Tables']['prompts']['Row'];
export type PromptInsert = Database['public']['Tables']['prompts']['Insert'];
export type PromptUpdate = Database['public']['Tables']['prompts']['Update'];
