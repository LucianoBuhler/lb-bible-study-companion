import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for better TypeScript support
export type Database = {
  public: {
    Tables: {
      books: {
        Row: {
          id: string
          name: string
          abbreviation: string
          testament: 'Old' | 'New'
          book_order: number
          chapter_count: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          abbreviation: string
          testament: 'Old' | 'New'
          book_order: number
          chapter_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          abbreviation?: string
          testament?: 'Old' | 'New'
          book_order?: number
          chapter_count?: number
          created_at?: string
        }
      }
      verses: {
        Row: {
          id: string
          book_id: string | null
          book_name: string
          chapter: number
          verse: number
          text: string
          translation: string
          created_at: string
        }
        Insert: {
          id?: string
          book_id?: string | null
          book_name: string
          chapter: number
          verse: number
          text: string
          translation?: string
          created_at?: string
        }
        Update: {
          id?: string
          book_id?: string | null
          book_name?: string
          chapter?: number
          verse?: number
          text?: string
          translation?: string
          created_at?: string
        }
      }
      commentaries: {
        Row: {
          id: string
          verse_id: string | null
          author: string
          text: string
          source: string | null
          commentary_type: string
          created_at: string
        }
        Insert: {
          id?: string
          verse_id?: string | null
          author: string
          text: string
          source?: string | null
          commentary_type?: string
          created_at?: string
        }
        Update: {
          id?: string
          verse_id?: string | null
          author?: string
          text?: string
          source?: string | null
          commentary_type?: string
          created_at?: string
        }
      }
      study_sessions: {
        Row: {
          id: string
          user_id: string
          title: string
          query: string
          notes: string
          verse_ids: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          query: string
          notes?: string
          verse_ids?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          query?: string
          notes?: string
          verse_ids?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      quiz_questions: {
        Row: {
          id: string
          question: string
          options: string[]
          correct_answer: number
          explanation: string
          verse_reference: string
          verse_id: string | null
          difficulty: 'easy' | 'medium' | 'hard'
          topic: string | null
          created_at: string
        }
        Insert: {
          id?: string
          question: string
          options: string[]
          correct_answer: number
          explanation: string
          verse_reference: string
          verse_id?: string | null
          difficulty: 'easy' | 'medium' | 'hard'
          topic?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          question?: string
          options?: string[]
          correct_answer?: number
          explanation?: string
          verse_reference?: string
          verse_id?: string | null
          difficulty?: 'easy' | 'medium' | 'hard'
          topic?: string | null
          created_at?: string
        }
      }
    }
  }
}