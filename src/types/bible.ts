export interface Verse {
  id: string
  book: string
  chapter: number
  verse: number
  text: string
  translation: string
}

export interface Commentary {
  id: string
  verse_id: string
  author: string
  text: string
  source: string
  created_at: string
}

export interface StudyNote {
  id: string
  user_id: string
  verse_id: string
  title: string
  content: string
  tags: string[]
  created_at: string
  updated_at: string
}

export interface CrossReference {
  id: string
  verse_id: string
  related_verse_id: string
  relationship_type: 'parallel' | 'contrast' | 'fulfillment' | 'quotation' | 'allusion'
  description?: string
}

export interface SearchResult {
  verse: Verse
  commentary?: Commentary[]
  relevance_score: number
  context_verses?: Verse[]
}

export interface StudySession {
  id: string
  user_id: string
  title: string
  query: string
  results: SearchResult[]
  notes: string
  created_at: string
  updated_at: string
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correct_answer: number
  explanation: string
  verse_reference: string
  difficulty: 'easy' | 'medium' | 'hard'
}