export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users_profile: {
        Row: {
          id: string
          email: string
          full_name: string | null
          credits: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          credits?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          credits?: number
          created_at?: string
          updated_at?: string
        }
      }
      evaluations: {
        Row: {
          id: string
          user_id: string
          media_url: string
          media_type: 'image' | 'video'
          user_message: string
          status: 'pending' | 'in_progress' | 'completed'
          feedback_type: 'text' | 'audio' | null
          feedback_content: string | null
          feedback_audio_url: string | null
          created_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          media_url: string
          media_type: 'image' | 'video'
          user_message: string
          status?: 'pending' | 'in_progress' | 'completed'
          feedback_type?: 'text' | 'audio' | null
          feedback_content?: string | null
          feedback_audio_url?: string | null
          created_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          media_url?: string
          media_type?: 'image' | 'video'
          user_message?: string
          status?: 'pending' | 'in_progress' | 'completed'
          feedback_type?: 'text' | 'audio' | null
          feedback_content?: string | null
          feedback_audio_url?: string | null
          created_at?: string
          completed_at?: string | null
        }
      }
      evaluation_questions: {
        Row: {
          id: string
          evaluation_id: string
          user_id: string
          question: string
          answer: string | null
          created_at: string
          answered_at: string | null
        }
        Insert: {
          id?: string
          evaluation_id: string
          user_id: string
          question: string
          answer?: string | null
          created_at?: string
          answered_at?: string | null
        }
        Update: {
          id?: string
          evaluation_id?: string
          user_id?: string
          question?: string
          answer?: string | null
          created_at?: string
          answered_at?: string | null
        }
      }
      credit_packages: {
        Row: {
          id: string
          name: string
          credits: number
          price_usd: number
          price_try: number
          stripe_price_id_usd: string | null
          stripe_price_id_try: string | null
          is_active: boolean
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          credits: number
          price_usd: number
          price_try: number
          stripe_price_id_usd?: string | null
          stripe_price_id_try?: string | null
          is_active?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          credits?: number
          price_usd?: number
          price_try?: number
          stripe_price_id_usd?: string | null
          stripe_price_id_try?: string | null
          is_active?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      system_settings: {
        Row: {
          key: string
          value: Json
          updated_at: string
        }
        Insert: {
          key: string
          value: Json
          updated_at?: string
        }
        Update: {
          key?: string
          value?: Json
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          stripe_payment_intent_id: string
          package_id: string
          amount: number
          currency: string
          credits_added: number
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_payment_intent_id: string
          package_id: string
          amount: number
          currency: string
          credits_added: number
          status: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_payment_intent_id?: string
          package_id?: string
          amount?: number
          currency?: string
          credits_added?: number
          status?: string
          created_at?: string
        }
      }
      landing_content: {
        Row: {
          id: string
          section: string
          content: Json
          language: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          section: string
          content: Json
          language: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          section?: string
          content?: Json
          language?: string
          created_at?: string
          updated_at?: string
        }
      }
      public_gallery: {
        Row: {
          id: string
          evaluation_id: string
          is_featured: boolean
          created_at: string
        }
        Insert: {
          id?: string
          evaluation_id: string
          is_featured?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          evaluation_id?: string
          is_featured?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

