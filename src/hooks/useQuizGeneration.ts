import { useState, useCallback } from 'react'
import { QuizQuestion } from '../types/bible'

// Mock quiz questions for demonstration
const mockQuizQuestions: QuizQuestion[] = [
  {
    id: '1',
    question: 'According to John 3:16, what did God give because of His love for the world?',
    options: [
      'His wisdom',
      'His one and only Son',
      'His kingdom',
      'His commandments'
    ],
    correct_answer: 1,
    explanation: 'John 3:16 states that God gave His one and only Son because of His great love for the world, so that whoever believes in Him shall not perish but have eternal life.',
    verse_reference: 'John 3:16',
    difficulty: 'easy'
  },
  {
    id: '2',
    question: 'In the parable of the Prodigal Son, what did the father do when he saw his son returning?',
    options: [
      'He waited for his son to apologize first',
      'He ran to him and embraced him',
      'He sent servants to meet him',
      'He prepared a test for him'
    ],
    correct_answer: 1,
    explanation: 'Luke 15:20 tells us that while the son was still a long way off, his father saw him and was filled with compassion. He ran to his son, threw his arms around him and kissed him.',
    verse_reference: 'Luke 15:20',
    difficulty: 'medium'
  },
  {
    id: '3',
    question: 'What does 1 Corinthians 13:4 say love is?',
    options: [
      'Patient and kind',
      'Strong and mighty',
      'Wise and understanding',
      'Pure and holy'
    ],
    correct_answer: 0,
    explanation: '1 Corinthians 13:4 begins the famous "love chapter" by stating that "Love is patient, love is kind. It does not envy, it does not boast, it is not proud."',
    verse_reference: '1 Corinthians 13:4',
    difficulty: 'easy'
  },
  {
    id: '4',
    question: 'According to Romans 8:28, for whom do all things work together for good?',
    options: [
      'For everyone without exception',
      'For those who love God and are called according to His purpose',
      'For those who are wealthy',
      'For those who never sin'
    ],
    correct_answer: 1,
    explanation: 'Romans 8:28 specifically states that "all things work together for good to those who love God, to those who are the called according to His purpose."',
    verse_reference: 'Romans 8:28',
    difficulty: 'medium'
  },
  {
    id: '5',
    question: 'What is the condition for receiving forgiveness according to Matthew 6:14?',
    options: [
      'Praying three times daily',
      'Giving to the poor',
      'Forgiving others when they sin against you',
      'Fasting regularly'
    ],
    correct_answer: 2,
    explanation: 'Matthew 6:14 teaches that "if you forgive other people when they sin against you, your heavenly Father will also forgive you."',
    verse_reference: 'Matthew 6:14',
    difficulty: 'hard'
  }
]

export function useQuizGeneration() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [error, setError] = useState<string | null>(null)

  const generateQuiz = useCallback(async (topic: string, difficulty?: 'easy' | 'medium' | 'hard', count: number = 5) => {
    setIsGenerating(true)
    setError(null)

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Filter questions based on criteria
      let filteredQuestions = mockQuizQuestions

      if (difficulty) {
        filteredQuestions = filteredQuestions.filter(q => q.difficulty === difficulty)
      }

      // If we don't have enough questions of the specified difficulty, include others
      if (filteredQuestions.length < count) {
        filteredQuestions = mockQuizQuestions
      }

      // Shuffle and take the requested number
      const shuffled = [...filteredQuestions].sort(() => Math.random() - 0.5)
      const selectedQuestions = shuffled.slice(0, Math.min(count, shuffled.length))

      setQuestions(selectedQuestions)
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