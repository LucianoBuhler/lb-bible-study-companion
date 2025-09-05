/*
  # Bible Study Companion Database Schema

  1. New Tables
    - `books` - Bible books (Genesis, Exodus, etc.)
    - `verses` - Individual Bible verses with text
    - `commentaries` - Commentary entries for verses
    - `cross_references` - Cross-reference relationships between verses
    - `study_notes` - User-created study notes
    - `study_sessions` - User study sessions
    - `quiz_questions` - Generated quiz questions
    - `user_favorites` - User favorite verses
    - `user_progress` - User reading/study progress

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Public read access for biblical content
    - User-specific access for personal data

  3. Indexes
    - Full-text search indexes on verses and commentary
    - Performance indexes on commonly queried fields
*/

-- Books table
CREATE TABLE IF NOT EXISTS books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  abbreviation text NOT NULL,
  testament text NOT NULL CHECK (testament IN ('Old', 'New')),
  book_order integer NOT NULL,
  chapter_count integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Verses table
CREATE TABLE IF NOT EXISTS verses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id uuid REFERENCES books(id) ON DELETE CASCADE,
  book_name text NOT NULL,
  chapter integer NOT NULL,
  verse integer NOT NULL,
  text text NOT NULL,
  translation text NOT NULL DEFAULT 'KJV',
  created_at timestamptz DEFAULT now(),
  UNIQUE(book_name, chapter, verse, translation)
);

-- Commentaries table
CREATE TABLE IF NOT EXISTS commentaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  verse_id uuid REFERENCES verses(id) ON DELETE CASCADE,
  author text NOT NULL,
  text text NOT NULL,
  source text,
  commentary_type text DEFAULT 'general',
  created_at timestamptz DEFAULT now()
);

-- Cross references table
CREATE TABLE IF NOT EXISTS cross_references (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  verse_id uuid REFERENCES verses(id) ON DELETE CASCADE,
  related_verse_id uuid REFERENCES verses(id) ON DELETE CASCADE,
  relationship_type text NOT NULL CHECK (relationship_type IN ('parallel', 'contrast', 'fulfillment', 'quotation', 'allusion')),
  description text,
  created_at timestamptz DEFAULT now()
);

-- Study notes table (user-specific)
CREATE TABLE IF NOT EXISTS study_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  verse_id uuid REFERENCES verses(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  tags text[] DEFAULT '{}',
  is_private boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Study sessions table (user-specific)
CREATE TABLE IF NOT EXISTS study_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  query text NOT NULL,
  notes text DEFAULT '',
  verse_ids uuid[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Quiz questions table
CREATE TABLE IF NOT EXISTS quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  options jsonb NOT NULL,
  correct_answer integer NOT NULL,
  explanation text NOT NULL,
  verse_reference text NOT NULL,
  verse_id uuid REFERENCES verses(id) ON DELETE SET NULL,
  difficulty text NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  topic text,
  created_at timestamptz DEFAULT now()
);

-- User favorites table
CREATE TABLE IF NOT EXISTS user_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  verse_id uuid REFERENCES verses(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, verse_id)
);

-- User progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id uuid REFERENCES books(id) ON DELETE CASCADE,
  chapter integer NOT NULL,
  last_verse integer DEFAULT 1,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, book_id, chapter)
);

-- Enable Row Level Security
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE verses ENABLE ROW LEVEL SECURITY;
ALTER TABLE commentaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE cross_references ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Books: Public read access
CREATE POLICY "Books are publicly readable"
  ON books
  FOR SELECT
  TO public
  USING (true);

-- Verses: Public read access
CREATE POLICY "Verses are publicly readable"
  ON verses
  FOR SELECT
  TO public
  USING (true);

-- Commentaries: Public read access
CREATE POLICY "Commentaries are publicly readable"
  ON commentaries
  FOR SELECT
  TO public
  USING (true);

-- Cross references: Public read access
CREATE POLICY "Cross references are publicly readable"
  ON cross_references
  FOR SELECT
  TO public
  USING (true);

-- Quiz questions: Public read access
CREATE POLICY "Quiz questions are publicly readable"
  ON quiz_questions
  FOR SELECT
  TO public
  USING (true);

-- Study notes: User-specific access
CREATE POLICY "Users can manage their own study notes"
  ON study_notes
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Study sessions: User-specific access
CREATE POLICY "Users can manage their own study sessions"
  ON study_sessions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- User favorites: User-specific access
CREATE POLICY "Users can manage their own favorites"
  ON user_favorites
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- User progress: User-specific access
CREATE POLICY "Users can manage their own progress"
  ON user_progress
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_verses_book_chapter_verse ON verses(book_name, chapter, verse);
CREATE INDEX IF NOT EXISTS idx_verses_text_search ON verses USING gin(to_tsvector('english', text));
CREATE INDEX IF NOT EXISTS idx_commentaries_verse_id ON commentaries(verse_id);
CREATE INDEX IF NOT EXISTS idx_commentaries_text_search ON commentaries USING gin(to_tsvector('english', text));
CREATE INDEX IF NOT EXISTS idx_cross_references_verse_id ON cross_references(verse_id);
CREATE INDEX IF NOT EXISTS idx_study_notes_user_id ON study_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_user_id ON study_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);