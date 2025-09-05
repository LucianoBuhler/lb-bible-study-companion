import { useState, useCallback } from 'react'
import { SearchResult, Verse, Commentary } from '../types/bible'
import { SearchType } from '../components/SearchBar'
import { supabase } from '../lib/supabase'

export function useBibleSearch() {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [error, setError] = useState<string | null>(null)

  const searchVerses = async (query: string, type: SearchType) => {
    let queryBuilder = supabase
      .from('verses')
      .select(`
        id,
        book_name,
        chapter,
        verse,
        text,
        translation
      `)

    switch (type) {
      case 'verse':
        // Search by verse reference or text content
        if (query.match(/\d+:\d+/)) {
          // Looks like a verse reference (e.g., "John 3:16")
          const parts = query.split(/\s+/)
          if (parts.length >= 2) {
            const bookPart = parts.slice(0, -1).join(' ')
            const refPart = parts[parts.length - 1]
            const [chapter, verse] = refPart.split(':').map(Number)
            
            queryBuilder = queryBuilder
              .ilike('book_name', `%${bookPart}%`)
              .eq('chapter', chapter)
              .eq('verse', verse)
          }
        } else {
          // Search in verse text
          queryBuilder = queryBuilder.textSearch('text', query)
        }
        break
      case 'topic':
        // Search for topic-related keywords in verse text
        queryBuilder = queryBuilder.textSearch('text', query)
        break
      case 'commentary':
        // This will be handled separately
        break
      case 'cross-reference':
        // Search broadly for now
        queryBuilder = queryBuilder.textSearch('text', query)
        break
    }

    queryBuilder = queryBuilder.limit(20)
    return queryBuilder
  }

  const searchCommentary = async (query: string) => {
    return supabase
      .from('commentaries')
      .select(`
        id,
        verse_id,
        author,
        text,
        source,
        created_at,
        verses!inner (
          id,
          book_name,
          chapter,
          verse,
          text,
          translation
        )
      `)
      .textSearch('text', query)
      .limit(20)
  }

  const search = useCallback(async (query: string, type: SearchType) => {
    setIsLoading(true)
    setError(null)

    try {
      let searchResults: SearchResult[] = []

      if (type === 'commentary') {
        // Search in commentary and get associated verses
        const { data: commentaryData, error: commentaryError } = await searchCommentary(query)
        
        if (commentaryError) throw commentaryError
        
        searchResults = (commentaryData || []).map(item => ({
          verse: {
            id: item.verses.id,
            book: item.verses.book_name,
            chapter: item.verses.chapter,
            verse: item.verses.verse,
            text: item.verses.text,
            translation: item.verses.translation
          },
          commentary: [{
            id: item.id,
            verse_id: item.verse_id,
            author: item.author,
            text: item.text,
            source: item.source || '',
            created_at: item.created_at
          }],
          relevance_score: 0.8,
          context_verses: []
        }))
      } else {
        // Search in verses
        const { data: versesData, error: versesError } = await searchVerses(query, type)
        
        if (versesError) throw versesError
        
        // Get commentary for found verses
        const verseIds = (versesData || []).map(v => v.id)
        let commentaryData: any[] = []
        
        if (verseIds.length > 0) {
          const { data: comments } = await supabase
            .from('commentaries')
            .select('*')
            .in('verse_id', verseIds)
          
          commentaryData = comments || []
        }
        
        searchResults = (versesData || []).map(verse => ({
          verse: {
            id: verse.id,
            book: verse.book_name,
            chapter: verse.chapter,
            verse: verse.verse,
            text: verse.text,
            translation: verse.translation
          },
          commentary: commentaryData.filter(c => c.verse_id === verse.id).map(c => ({
            id: c.id,
            verse_id: c.verse_id,
            author: c.author,
            text: c.text,
            source: c.source || '',
            created_at: c.created_at
          })),
          relevance_score: Math.random() * 0.4 + 0.6, // Mock relevance for now
          context_verses: []
        }))
      }

      setResults(searchResults)
    } catch (err) {
      setError('Failed to search. Please check your connection and try again.')
      console.error('Search error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    search,
    results,
    isLoading,
    error,
    clearResults: () => setResults([])
  }
}