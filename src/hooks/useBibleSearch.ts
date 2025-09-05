import { useState, useCallback } from 'react'
import { SearchResult, Verse, Commentary } from '../types/bible'
import { SearchType } from '../components/SearchBar'

// Mock data for demonstration
const mockVerses: Verse[] = [
  {
    id: '1',
    book: 'John',
    chapter: 3,
    verse: 16,
    text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
    translation: 'NIV'
  },
  {
    id: '2',
    book: 'Matthew',
    chapter: 6,
    verse: 14,
    text: 'For if you forgive other people when they sin against you, your heavenly Father will also forgive you.',
    translation: 'NIV'
  },
  {
    id: '3',
    book: 'Luke',
    chapter: 15,
    verse: 11,
    text: 'Jesus continued: "There was a man who had two sons."',
    translation: 'NIV'
  },
  {
    id: '4',
    book: '1 Corinthians',
    chapter: 13,
    verse: 4,
    text: 'Love is patient, love is kind. It does not envy, it does not boast, it is not proud.',
    translation: 'NIV'
  },
  {
    id: '5',
    book: 'Romans',
    chapter: 8,
    verse: 28,
    text: 'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.',
    translation: 'NIV'
  }
]

const mockCommentary: Commentary[] = [
  {
    id: '1',
    verse_id: '1',
    author: 'Matthew Henry',
    text: 'This verse encapsulates the entire gospel message. God\'s love is the source, Christ\'s sacrifice is the means, and eternal life is the result for all who believe.',
    source: 'Matthew Henry Commentary',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    verse_id: '2',
    author: 'John Wesley',
    text: 'Forgiveness is not optional for the Christian. As we have been forgiven much, we must extend that same grace to others.',
    source: 'Wesley\'s Notes',
    created_at: '2024-01-01T00:00:00Z'
  }
]

export function useBibleSearch() {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [error, setError] = useState<string | null>(null)

  const search = useCallback(async (query: string, type: SearchType) => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Mock search logic
      let filteredVerses: Verse[] = []
      
      switch (type) {
        case 'verse':
          filteredVerses = mockVerses.filter(verse =>
            verse.text.toLowerCase().includes(query.toLowerCase()) ||
            `${verse.book} ${verse.chapter}:${verse.verse}`.toLowerCase().includes(query.toLowerCase())
          )
          break
        case 'topic':
          // Simple topic matching
          if (query.toLowerCase().includes('love')) {
            filteredVerses = mockVerses.filter(v => v.id === '1' || v.id === '4')
          } else if (query.toLowerCase().includes('forgive')) {
            filteredVerses = mockVerses.filter(v => v.id === '2')
          } else if (query.toLowerCase().includes('parable')) {
            filteredVerses = mockVerses.filter(v => v.id === '3')
          } else {
            filteredVerses = mockVerses.slice(0, 2)
          }
          break
        case 'commentary':
          filteredVerses = mockVerses.filter(verse =>
            mockCommentary.some(comment => 
              comment.verse_id === verse.id && 
              comment.text.toLowerCase().includes(query.toLowerCase())
            )
          )
          break
        case 'cross-reference':
          filteredVerses = mockVerses.slice(0, 3)
          break
        default:
          filteredVerses = mockVerses
      }

      const searchResults: SearchResult[] = filteredVerses.map(verse => ({
        verse,
        commentary: mockCommentary.filter(c => c.verse_id === verse.id),
        relevance_score: Math.random() * 0.4 + 0.6, // Mock relevance score
        context_verses: []
      }))

      setResults(searchResults)
    } catch (err) {
      setError('Failed to search. Please try again.')
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