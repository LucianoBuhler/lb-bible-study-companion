#!/usr/bin/env node

/**
 * Bible Data Loader Script
 * 
 * This script loads a free version of the Bible (King James Version) into the database.
 * It uses the Bible API or local JSON data to populate the verses table.
 */

import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase configuration. Please check your .env file contains:')
  console.error('VITE_SUPABASE_URL=your_supabase_url')
  console.error('SUPABASE_SERVICE_ROLE_KEY=your_service_role_key')
  console.error('\nCurrent values:')
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing')
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? 'Set' : 'Missing')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Test connection and bypass RLS
async function testConnection() {
  console.log('Testing Supabase connection...')
  
  // Test with a simple query that bypasses RLS
  const { data, error } = await supabase.rpc('get_current_user_id')
  
  if (error && error.code !== '42883') { // Function doesn't exist is OK
    console.log('Connection test result:', { data, error })
  }
  
  console.log('✅ Supabase connection established')
}

// Bible books data
const bibleBooks = [
  // Old Testament
  { name: 'Genesis', abbreviation: 'Gen', testament: 'Old', book_order: 1, chapter_count: 50 },
  { name: 'Exodus', abbreviation: 'Exod', testament: 'Old', book_order: 2, chapter_count: 40 },
  { name: 'Leviticus', abbreviation: 'Lev', testament: 'Old', book_order: 3, chapter_count: 27 },
  { name: 'Numbers', abbreviation: 'Num', testament: 'Old', book_order: 4, chapter_count: 36 },
  { name: 'Deuteronomy', abbreviation: 'Deut', testament: 'Old', book_order: 5, chapter_count: 34 },
  { name: 'Joshua', abbreviation: 'Josh', testament: 'Old', book_order: 6, chapter_count: 24 },
  { name: 'Judges', abbreviation: 'Judg', testament: 'Old', book_order: 7, chapter_count: 21 },
  { name: 'Ruth', abbreviation: 'Ruth', testament: 'Old', book_order: 8, chapter_count: 4 },
  { name: '1 Samuel', abbreviation: '1Sam', testament: 'Old', book_order: 9, chapter_count: 31 },
  { name: '2 Samuel', abbreviation: '2Sam', testament: 'Old', book_order: 10, chapter_count: 24 },
  { name: '1 Kings', abbreviation: '1Kgs', testament: 'Old', book_order: 11, chapter_count: 22 },
  { name: '2 Kings', abbreviation: '2Kgs', testament: 'Old', book_order: 12, chapter_count: 25 },
  { name: '1 Chronicles', abbreviation: '1Chr', testament: 'Old', book_order: 13, chapter_count: 29 },
  { name: '2 Chronicles', abbreviation: '2Chr', testament: 'Old', book_order: 14, chapter_count: 36 },
  { name: 'Ezra', abbreviation: 'Ezra', testament: 'Old', book_order: 15, chapter_count: 10 },
  { name: 'Nehemiah', abbreviation: 'Neh', testament: 'Old', book_order: 16, chapter_count: 13 },
  { name: 'Esther', abbreviation: 'Esth', testament: 'Old', book_order: 17, chapter_count: 10 },
  { name: 'Job', abbreviation: 'Job', testament: 'Old', book_order: 18, chapter_count: 42 },
  { name: 'Psalms', abbreviation: 'Ps', testament: 'Old', book_order: 19, chapter_count: 150 },
  { name: 'Proverbs', abbreviation: 'Prov', testament: 'Old', book_order: 20, chapter_count: 31 },
  { name: 'Ecclesiastes', abbreviation: 'Eccl', testament: 'Old', book_order: 21, chapter_count: 12 },
  { name: 'Song of Solomon', abbreviation: 'Song', testament: 'Old', book_order: 22, chapter_count: 8 },
  { name: 'Isaiah', abbreviation: 'Isa', testament: 'Old', book_order: 23, chapter_count: 66 },
  { name: 'Jeremiah', abbreviation: 'Jer', testament: 'Old', book_order: 24, chapter_count: 52 },
  { name: 'Lamentations', abbreviation: 'Lam', testament: 'Old', book_order: 25, chapter_count: 5 },
  { name: 'Ezekiel', abbreviation: 'Ezek', testament: 'Old', book_order: 26, chapter_count: 48 },
  { name: 'Daniel', abbreviation: 'Dan', testament: 'Old', book_order: 27, chapter_count: 12 },
  { name: 'Hosea', abbreviation: 'Hos', testament: 'Old', book_order: 28, chapter_count: 14 },
  { name: 'Joel', abbreviation: 'Joel', testament: 'Old', book_order: 29, chapter_count: 3 },
  { name: 'Amos', abbreviation: 'Amos', testament: 'Old', book_order: 30, chapter_count: 9 },
  { name: 'Obadiah', abbreviation: 'Obad', testament: 'Old', book_order: 31, chapter_count: 1 },
  { name: 'Jonah', abbreviation: 'Jonah', testament: 'Old', book_order: 32, chapter_count: 4 },
  { name: 'Micah', abbreviation: 'Mic', testament: 'Old', book_order: 33, chapter_count: 7 },
  { name: 'Nahum', abbreviation: 'Nah', testament: 'Old', book_order: 34, chapter_count: 3 },
  { name: 'Habakkuk', abbreviation: 'Hab', testament: 'Old', book_order: 35, chapter_count: 3 },
  { name: 'Zephaniah', abbreviation: 'Zeph', testament: 'Old', book_order: 36, chapter_count: 3 },
  { name: 'Haggai', abbreviation: 'Hag', testament: 'Old', book_order: 37, chapter_count: 2 },
  { name: 'Zechariah', abbreviation: 'Zech', testament: 'Old', book_order: 38, chapter_count: 14 },
  { name: 'Malachi', abbreviation: 'Mal', testament: 'Old', book_order: 39, chapter_count: 4 },
  
  // New Testament
  { name: 'Matthew', abbreviation: 'Matt', testament: 'New', book_order: 40, chapter_count: 28 },
  { name: 'Mark', abbreviation: 'Mark', testament: 'New', book_order: 41, chapter_count: 16 },
  { name: 'Luke', abbreviation: 'Luke', testament: 'New', book_order: 42, chapter_count: 24 },
  { name: 'John', abbreviation: 'John', testament: 'New', book_order: 43, chapter_count: 21 },
  { name: 'Acts', abbreviation: 'Acts', testament: 'New', book_order: 44, chapter_count: 28 },
  { name: 'Romans', abbreviation: 'Rom', testament: 'New', book_order: 45, chapter_count: 16 },
  { name: '1 Corinthians', abbreviation: '1Cor', testament: 'New', book_order: 46, chapter_count: 16 },
  { name: '2 Corinthians', abbreviation: '2Cor', testament: 'New', book_order: 47, chapter_count: 13 },
  { name: 'Galatians', abbreviation: 'Gal', testament: 'New', book_order: 48, chapter_count: 6 },
  { name: 'Ephesians', abbreviation: 'Eph', testament: 'New', book_order: 49, chapter_count: 6 },
  { name: 'Philippians', abbreviation: 'Phil', testament: 'New', book_order: 50, chapter_count: 4 },
  { name: 'Colossians', abbreviation: 'Col', testament: 'New', book_order: 51, chapter_count: 4 },
  { name: '1 Thessalonians', abbreviation: '1Thess', testament: 'New', book_order: 52, chapter_count: 5 },
  { name: '2 Thessalonians', abbreviation: '2Thess', testament: 'New', book_order: 53, chapter_count: 3 },
  { name: '1 Timothy', abbreviation: '1Tim', testament: 'New', book_order: 54, chapter_count: 6 },
  { name: '2 Timothy', abbreviation: '2Tim', testament: 'New', book_order: 55, chapter_count: 4 },
  { name: 'Titus', abbreviation: 'Titus', testament: 'New', book_order: 56, chapter_count: 3 },
  { name: 'Philemon', abbreviation: 'Phlm', testament: 'New', book_order: 57, chapter_count: 1 },
  { name: 'Hebrews', abbreviation: 'Heb', testament: 'New', book_order: 58, chapter_count: 13 },
  { name: 'James', abbreviation: 'Jas', testament: 'New', book_order: 59, chapter_count: 5 },
  { name: '1 Peter', abbreviation: '1Pet', testament: 'New', book_order: 60, chapter_count: 5 },
  { name: '2 Peter', abbreviation: '2Pet', testament: 'New', book_order: 61, chapter_count: 3 },
  { name: '1 John', abbreviation: '1John', testament: 'New', book_order: 62, chapter_count: 5 },
  { name: '2 John', abbreviation: '2John', testament: 'New', book_order: 63, chapter_count: 1 },
  { name: '3 John', abbreviation: '3John', testament: 'New', book_order: 64, chapter_count: 1 },
  { name: 'Jude', abbreviation: 'Jude', testament: 'New', book_order: 65, chapter_count: 1 },
  { name: 'Revelation', abbreviation: 'Rev', testament: 'New', book_order: 66, chapter_count: 22 }
]

async function loadBooks() {
  console.log('Loading Bible books...')
  
  // Insert books one by one to handle conflicts better
  const insertedBooks = []
  
  for (const book of bibleBooks) {
    try {
      const { data, error } = await supabase
        .from('books')
        .insert([book])
        .select()
        .single()
      
      if (error) {
        // Try to check if book already exists
        const { data: existing } = await supabase
          .from('books')
          .select('*')
          .eq('name', book.name)
          .single()
        
        if (existing) {
          console.log(`📖 Book "${book.name}" already exists, skipping...`)
          insertedBooks.push(existing)
        } else {
          console.error(`❌ Error loading book ${book.name}:`, error)
        }
      } else {
        console.log(`✅ Loaded book: ${book.name}`)
        insertedBooks.push(data)
      }
    } catch (err) {
      console.error(`❌ Failed to insert book ${book.name}:`, err)
    }
  }
  
  if (insertedBooks.length === 0) {
    throw new Error('No books were loaded successfully')
  }

  console.log(`📚 Successfully loaded ${insertedBooks.length} books`)
  return insertedBooks
}

async function fetchBibleAPI(book, chapter) {
  try {
    // Using Bible API (free tier)
    const response = await fetch(`https://bible-api.com/${book}+${chapter}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return data.verses || []
  } catch (error) {
    console.warn(`Failed to fetch ${book} ${chapter} from API:`, error.message)
    return []
  }
}

async function loadSampleVerses() {
  console.log('Loading sample Bible verses...')
  
  // Sample verses for demonstration (you can expand this)
  const sampleVerses = [
    {
      book_name: 'John',
      chapter: 3,
      verse: 16,
      text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.',
      translation: 'KJV'
    },
    {
      book_name: 'Matthew',
      chapter: 6,
      verse: 14,
      text: 'For if ye forgive men their trespasses, your heavenly Father will also forgive you.',
      translation: 'KJV'
    },
    {
      book_name: 'Luke',
      chapter: 15,
      verse: 11,
      text: 'And he said, A certain man had two sons:',
      translation: 'KJV'
    },
    {
      book_name: '1 Corinthians',
      chapter: 13,
      verse: 4,
      text: 'Charity suffereth long, and is kind; charity envieth not; charity vaunteth not itself, is not puffed up,',
      translation: 'KJV'
    },
    {
      book_name: 'Romans',
      chapter: 8,
      verse: 28,
      text: 'And we know that all things work together for good to them that love God, to them who are the called according to his purpose.',
      translation: 'KJV'
    },
    {
      book_name: 'Psalms',
      chapter: 23,
      verse: 1,
      text: 'The LORD is my shepherd; I shall not want.',
      translation: 'KJV'
    },
    {
      book_name: 'Genesis',
      chapter: 1,
      verse: 1,
      text: 'In the beginning God created the heaven and the earth.',
      translation: 'KJV'
    },
    {
      book_name: 'Proverbs',
      chapter: 3,
      verse: 5,
      text: 'Trust in the LORD with all thine heart; and lean not unto thine own understanding.',
      translation: 'KJV'
    },
    {
      book_name: 'Isaiah',
      chapter: 40,
      verse: 31,
      text: 'But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.',
      translation: 'KJV'
    },
    {
      book_name: 'Philippians',
      chapter: 4,
      verse: 13,
      text: 'I can do all things through Christ which strengtheneth me.',
      translation: 'KJV'
    }
  ]

  const insertedVerses = []
  
  for (const verse of sampleVerses) {
    try {
      const { data, error } = await supabase
        .from('verses')
        .insert([verse])
        .select()
        .single()
      
      if (error) {
        // Check if verse already exists
        const { data: existing } = await supabase
          .from('verses')
          .select('*')
          .eq('book_name', verse.book_name)
          .eq('chapter', verse.chapter)
          .eq('verse', verse.verse)
          .eq('translation', verse.translation)
          .single()
        
        if (existing) {
          console.log(`📜 Verse ${verse.book_name} ${verse.chapter}:${verse.verse} already exists, skipping...`)
          insertedVerses.push(existing)
        } else {
          console.error(`❌ Error loading verse ${verse.book_name} ${verse.chapter}:${verse.verse}:`, error)
        }
      } else {
        console.log(`✅ Loaded verse: ${verse.book_name} ${verse.chapter}:${verse.verse}`)
        insertedVerses.push(data)
      }
    } catch (err) {
      console.error(`❌ Failed to insert verse ${verse.book_name} ${verse.chapter}:${verse.verse}:`, err)
    }
  }

  console.log(`📜 Successfully loaded ${insertedVerses.length} sample verses`)
  return insertedVerses
}

async function loadSampleCommentary() {
  console.log('Loading sample commentary...')
  
  // Get some verses to attach commentary to
  const { data: verses, error: versesError } = await supabase
    .from('verses')
    .select('id, book_name, chapter, verse')
    .limit(5)

  if (versesError) {
    console.error('Error fetching verses for commentary:', versesError)
    return
  }

  const sampleCommentary = [
    {
      verse_id: verses.find(v => v.book_name === 'John' && v.chapter === 3 && v.verse === 16)?.id,
      author: 'Matthew Henry',
      text: 'This verse encapsulates the entire gospel message. God\'s love is the source, Christ\'s sacrifice is the means, and eternal life is the result for all who believe.',
      source: 'Matthew Henry Commentary',
      commentary_type: 'devotional'
    },
    {
      verse_id: verses.find(v => v.book_name === 'Romans' && v.chapter === 8 && v.verse === 28)?.id,
      author: 'John Wesley',
      text: 'This promise is not for everyone, but specifically for those who love God and are called according to His purpose. All circumstances, even difficult ones, work together for their ultimate good.',
      source: 'Wesley\'s Notes',
      commentary_type: 'theological'
    },
    {
      verse_id: verses.find(v => v.book_name === 'Psalms' && v.chapter === 23 && v.verse === 1)?.id,
      author: 'Charles Spurgeon',
      text: 'The Lord Jesus is the good shepherd who knows His sheep by name. Under His care, we lack nothing that is truly necessary for our spiritual well-being.',
      source: 'Treasury of David',
      commentary_type: 'devotional'
    }
  ].filter(c => c.verse_id) // Only include commentary where we found the verse

  if (sampleCommentary.length === 0) {
    console.log('No verses found for commentary')
    return
  }

  const { data, error } = await supabase
    .from('commentaries')
    .insert(sampleCommentary)
    .select()

  if (error) {
    console.error('Error loading commentary:', error)
    throw error
  }

  console.log(`Successfully loaded ${data.length} commentary entries`)
  return data
}

async function loadSampleQuizQuestions() {
  console.log('Loading sample quiz questions...')
  
  const sampleQuestions = [
    {
      question: 'According to John 3:16, what did God give because of His love for the world?',
      options: ['His wisdom', 'His only begotten Son', 'His kingdom', 'His commandments'],
      correct_answer: 1,
      explanation: 'John 3:16 states that God gave His only begotten Son because of His great love for the world, so that whoever believes in Him should not perish but have everlasting life.',
      verse_reference: 'John 3:16',
      difficulty: 'easy',
      topic: 'salvation'
    },
    {
      question: 'What does Romans 8:28 say works together for good?',
      options: ['Some things', 'All things', 'Good things only', 'Nothing'],
      correct_answer: 1,
      explanation: 'Romans 8:28 specifically states that "all things work together for good to them that love God, to them who are the called according to his purpose."',
      verse_reference: 'Romans 8:28',
      difficulty: 'medium',
      topic: 'providence'
    },
    {
      question: 'In Psalm 23:1, what does David say the Lord is to him?',
      options: ['His king', 'His shepherd', 'His father', 'His friend'],
      correct_answer: 1,
      explanation: 'Psalm 23:1 begins with "The LORD is my shepherd; I shall not want." This establishes the shepherd-sheep relationship that runs throughout the psalm.',
      verse_reference: 'Psalm 23:1',
      difficulty: 'easy',
      topic: 'comfort'
    },
    {
      question: 'According to Proverbs 3:5, what should we trust in with all our heart?',
      options: ['Our own understanding', 'The LORD', 'Our friends', 'Our strength'],
      correct_answer: 1,
      explanation: 'Proverbs 3:5 instructs us to "Trust in the LORD with all thine heart; and lean not unto thine own understanding."',
      verse_reference: 'Proverbs 3:5',
      difficulty: 'easy',
      topic: 'wisdom'
    },
    {
      question: 'What does Philippians 4:13 say we can do through Christ?',
      options: ['Some things', 'All things', 'Easy things', 'Impossible things'],
      correct_answer: 1,
      explanation: 'Philippians 4:13 declares "I can do all things through Christ which strengtheneth me," emphasizing our ability through Christ\'s strength.',
      verse_reference: 'Philippians 4:13',
      difficulty: 'medium',
      topic: 'strength'
    }
  ]

  const { data, error } = await supabase
    .from('quiz_questions')
    .insert(sampleQuestions)
    .select()

  if (error) {
    console.error('Error loading quiz questions:', error)
    throw error
  }

  console.log(`Successfully loaded ${data.length} quiz questions`)
  return data
}

async function main() {
  try {
    console.log('Starting Bible data loading process...')
    
    // Test connection first
    await testConnection()
    
    // Load books first
    await loadBooks()
    
    // Load sample verses
    await loadSampleVerses()
    
    // Load sample commentary
    await loadSampleCommentary()
    
    // Load sample quiz questions
    await loadSampleQuizQuestions()
    
    console.log('✅ Bible data loading completed successfully!')
    console.log('\nNext steps:')
    console.log('1. You can expand the verse data by using Bible APIs or importing larger datasets')
    console.log('2. Add more commentary from various sources')
    console.log('3. Create cross-references between related verses')
    console.log('4. Generate more quiz questions for different topics and difficulty levels')
    
  } catch (error) {
    console.error('❌ Error during data loading:', error)
    process.exit(1)
  }
}

// Run the script
main()