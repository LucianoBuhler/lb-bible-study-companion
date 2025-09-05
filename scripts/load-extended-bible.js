#!/usr/bin/env node

/**
 * Extended Bible Data Loader
 * 
 * This script loads a more complete Bible dataset using the Bible API
 * or local JSON files. It's designed to load larger portions of the Bible.
 */

import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

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

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Popular chapters to load first
const popularChapters = [
  { book: 'Genesis', chapters: [1, 2, 3] },
  { book: 'Exodus', chapters: [20] }, // Ten Commandments
  { book: 'Psalms', chapters: [1, 23, 91, 119] },
  { book: 'Proverbs', chapters: [31] },
  { book: 'Isaiah', chapters: [53] },
  { book: 'Matthew', chapters: [5, 6, 7] }, // Sermon on the Mount
  { book: 'Mark', chapters: [16] },
  { book: 'Luke', chapters: [2, 15] }, // Birth of Jesus, Parables
  { book: 'John', chapters: [1, 3, 14, 15, 16, 17] },
  { book: 'Acts', chapters: [2] },
  { book: 'Romans', chapters: [8, 12] },
  { book: '1 Corinthians', chapters: [13, 15] }, // Love chapter, Resurrection
  { book: 'Ephesians', chapters: [2, 6] },
  { book: 'Philippians', chapters: [4] },
  { book: 'Hebrews', chapters: [11] }, // Faith chapter
  { book: 'James', chapters: [1] },
  { book: '1 John', chapters: [4] },
  { book: 'Revelation', chapters: [21, 22] }
]

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function fetchChapterFromAPI(book, chapter) {
  try {
    console.log(`Fetching ${book} ${chapter}...`)
    
    // Using Bible API with rate limiting
    await delay(100) // Rate limiting
    
    const response = await fetch(`https://bible-api.com/${book}+${chapter}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (!data.verses || data.verses.length === 0) {
      console.warn(`No verses found for ${book} ${chapter}`)
      return []
    }
    
    return data.verses.map(verse => ({
      book_name: book,
      chapter: verse.chapter,
      verse: verse.verse,
      text: verse.text,
      translation: 'KJV'
    }))
    
  } catch (error) {
    console.error(`Failed to fetch ${book} ${chapter}:`, error.message)
    return []
  }
}

async function loadPopularChapters() {
  console.log('Loading popular Bible chapters...')
  
  let totalVerses = 0
  let totalChapters = 0
  
  for (const bookData of popularChapters) {
    console.log(`\nLoading ${bookData.book}...`)
    
    for (const chapterNum of bookData.chapters) {
      const verses = await fetchChapterFromAPI(bookData.book, chapterNum)
      
      if (verses.length > 0) {
        const { data, error } = await supabase
          .from('verses')
          .upsert(verses, { onConflict: 'book_name,chapter,verse,translation' })
          .select('id')
        
        if (error) {
          console.error(`Error loading ${bookData.book} ${chapterNum}:`, error)
        } else {
          console.log(`✅ Loaded ${verses.length} verses from ${bookData.book} ${chapterNum}`)
          totalVerses += verses.length
          totalChapters += 1
        }
      }
    }
  }
  
  console.log(`\n🎉 Successfully loaded ${totalVerses} verses from ${totalChapters} chapters`)
}

async function loadExtendedCommentary() {
  console.log('\nLoading extended commentary...')
  
  const extendedCommentary = [
    // Genesis 1:1
    {
      book_name: 'Genesis', chapter: 1, verse: 1,
      author: 'John Calvin',
      text: 'Moses here begins with the creation of the world, not because he intended to write a natural history of the creation, but because he would lay the foundation of that doctrine which he meant to deliver concerning the eternal election of God.',
      source: 'Calvin\'s Commentary',
      commentary_type: 'theological'
    },
    // Psalm 23:1
    {
      book_name: 'Psalms', chapter: 23, verse: 1,
      author: 'Charles Spurgeon',
      text: 'The Lord Jesus is the good shepherd, and those who belong to him are his sheep, and are well cared for. This is a personal confession of faith. The psalmist does not say "The Lord is our shepherd," but "my shepherd."',
      source: 'Treasury of David',
      commentary_type: 'devotional'
    },
    // Matthew 5:3
    {
      book_name: 'Matthew', chapter: 5, verse: 3,
      author: 'Matthew Henry',
      text: 'The poor in spirit are those who are humble and lowly in their own eyes, who see their need of Christ and his grace, and who depend entirely upon God for salvation.',
      source: 'Matthew Henry Commentary',
      commentary_type: 'devotional'
    },
    // John 1:1
    {
      book_name: 'John', chapter: 1, verse: 1,
      author: 'John Chrysostom',
      text: 'The Word was in the beginning, and the Word was with God, and the Word was God. This teaches us that the Son is co-eternal with the Father, and that he is truly God.',
      source: 'Chrysostom\'s Homilies',
      commentary_type: 'theological'
    },
    // Romans 8:28
    {
      book_name: 'Romans', chapter: 8, verse: 28,
      author: 'John Wesley',
      text: 'All things work together for good - All the various dispensations of divine providence; all afflictions, temptations, persecutions; all things whatever that can happen to them.',
      source: 'Wesley\'s Notes',
      commentary_type: 'theological'
    },
    // 1 Corinthians 13:4
    {
      book_name: '1 Corinthians', chapter: 13, verse: 4,
      author: 'Albert Barnes',
      text: 'Love is patient - Love bears injuries and provocations without being filled with resentment or revenge. It is not easily provoked to anger.',
      source: 'Barnes\' Notes',
      commentary_type: 'expository'
    }
  ]
  
  // Find verse IDs for the commentary
  const commentaryWithIds = []
  
  for (const comment of extendedCommentary) {
    const { data: verses } = await supabase
      .from('verses')
      .select('id')
      .eq('book_name', comment.book_name)
      .eq('chapter', comment.chapter)
      .eq('verse', comment.verse)
      .limit(1)
    
    if (verses && verses.length > 0) {
      commentaryWithIds.push({
        verse_id: verses[0].id,
        author: comment.author,
        text: comment.text,
        source: comment.source,
        commentary_type: comment.commentary_type
      })
    }
  }
  
  if (commentaryWithIds.length > 0) {
    const { data, error } = await supabase
      .from('commentaries')
      .upsert(commentaryWithIds)
      .select()
    
    if (error) {
      console.error('Error loading extended commentary:', error)
    } else {
      console.log(`✅ Loaded ${data.length} extended commentary entries`)
    }
  }
}

async function createCrossReferences() {
  console.log('\nCreating cross-references...')
  
  // Get some verses to create cross-references for
  const { data: verses } = await supabase
    .from('verses')
    .select('id, book_name, chapter, verse')
    .in('book_name', ['John', 'Romans', 'Matthew', '1 John'])
  
  if (!verses || verses.length === 0) {
    console.log('No verses found for cross-references')
    return
  }
  
  const crossReferences = []
  
  // John 3:16 and 1 John 4:9 (God's love)
  const john316 = verses.find(v => v.book_name === 'John' && v.chapter === 3 && v.verse === 16)
  const john1_4_9 = verses.find(v => v.book_name === '1 John' && v.chapter === 4 && v.verse === 9)
  
  if (john316 && john1_4_9) {
    crossReferences.push({
      verse_id: john316.id,
      related_verse_id: john1_4_9.id,
      relationship_type: 'parallel',
      description: 'Both verses speak of God\'s love demonstrated through sending His Son'
    })
  }
  
  // Romans 8:28 and Romans 8:29 (sequential verses)
  const rom828 = verses.find(v => v.book_name === 'Romans' && v.chapter === 8 && v.verse === 28)
  const rom829 = verses.find(v => v.book_name === 'Romans' && v.chapter === 8 && v.verse === 29)
  
  if (rom828 && rom829) {
    crossReferences.push({
      verse_id: rom828.id,
      related_verse_id: rom829.id,
      relationship_type: 'parallel',
      description: 'Continuation of the same thought about God\'s purpose and calling'
    })
  }
  
  if (crossReferences.length > 0) {
    const { data, error } = await supabase
      .from('cross_references')
      .upsert(crossReferences)
      .select()
    
    if (error) {
      console.error('Error creating cross-references:', error)
    } else {
      console.log(`✅ Created ${data.length} cross-references`)
    }
  }
}

async function main() {
  try {
    console.log('Starting extended Bible data loading...')
    console.log('This will load popular chapters and extended content.')
    console.log('⚠️  This process may take several minutes due to API rate limits.\n')
    
    // Load popular chapters
    await loadPopularChapters()
    
    // Load extended commentary
    await loadExtendedCommentary()
    
    // Create cross-references
    await createCrossReferences()
    
    console.log('\n🎉 Extended Bible data loading completed!')
    console.log('\nYour database now contains:')
    console.log('- Popular Bible chapters with full text')
    console.log('- Extended commentary from various scholars')
    console.log('- Cross-references between related verses')
    console.log('\nYou can now use the Bible Study Companion with real biblical content!')
    
  } catch (error) {
    console.error('❌ Error during extended data loading:', error)
    process.exit(1)
  }
}

// Run the script
main()