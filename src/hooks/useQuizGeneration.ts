import { useState, useCallback } from 'react'
import { QuizQuestion } from '../types/bible'
import { supabase } from '../lib/supabase'

export function useQuizGeneration() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [error, setError] = useState<string | null>(null)

  const generateQuiz = useCallback(async (topic: string, difficulty?: 'easy' | 'medium' | 'hard', count: number = 5) => {
    setIsGenerating(true)
    setError(null)

    try {
      let query = supabase
        .from('quiz_questions')
        .select('*')
        .limit(count * 2) // Get more than needed for randomization

      // Filter by difficulty if specified
      if (difficulty) {
        query = query.eq('difficulty', difficulty)
      }

      // Filter by topic if not 'general'
      if (topic !== 'general') {
        query = query.eq('topic', topic)
      }

      const { data: quizData, error: quizError } = await query
      
      if (quizError) throw quizError
      
      let availableQuestions = quizData || []
      
      // If we don't have enough questions with the specified criteria, get more
      if (availableQuestions.length < count) {
        const { data: fallbackData } = await supabase
          .from('quiz_questions')
          .select('*')
          .limit(count * 2)
        
        availableQuestions = fallbackData || []
      }

      // Shuffle and take the requested number
      const shuffled = [...availableQuestions].sort(() => Math.random() - 0.5)
      const selectedQuestions = shuffled.slice(0, Math.min(count, shuffled.length))

      // Convert database format to component format
      const formattedQuestions: QuizQuestion[] = selectedQuestions.map(q => ({
        id: q.id,
        question: q.question,
        options: Array.isArray(q.options) ? q.options : [],
        correct_answer: q.correct_answer,
        explanation: q.explanation,
        verse_reference: q.verse_reference,
        difficulty: q.difficulty
      }))

      setQuestions(formattedQuestions)
    } catch (err) {
      setError('Failed to generate quiz. Please try again.')
      console.error('Quiz generation error:', err)
    } finally {
      setIsGenerating(false)
    }
  }, [])

  return {
    generateQuiz,
    questions,
    isGenerating,
    error,
    clearQuestions: () => setQuestions([])
  }
}