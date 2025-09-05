import React, { useState, useEffect } from 'react'
import { CheckCircle, XCircle, RotateCcw, Trophy, Brain } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card'
import { Button } from './ui/Button'
import { QuizQuestion } from '../types/bible'

interface QuizModeProps {
  questions: QuizQuestion[]
  onComplete?: (score: number, totalQuestions: number) => void
}

export function QuizMode({ questions, onComplete }: QuizModeProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>(
    new Array(questions.length).fill(false)
  )

  const currentQuestion = questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === questions.length - 1
  const isCorrect = selectedAnswer === currentQuestion?.correct_answer

  const handleAnswerSelect = (answerIndex: number) => {
    if (showExplanation) return
    setSelectedAnswer(answerIndex)
  }

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return

    setShowExplanation(true)
    
    if (isCorrect && !answeredQuestions[currentQuestionIndex]) {
      setScore(score + 1)
    }

    const newAnsweredQuestions = [...answeredQuestions]
    newAnsweredQuestions[currentQuestionIndex] = true
    setAnsweredQuestions(newAnsweredQuestions)
  }

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      onComplete?.(score + (isCorrect ? 1 : 0), questions.length)
      return
    }

    setCurrentQuestionIndex(currentQuestionIndex + 1)
    setSelectedAnswer(null)
    setShowExplanation(false)
  }

  const handleRestart = () => {
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setShowExplanation(false)
    setScore(0)
    setAnsweredQuestions(new Array(questions.length).fill(false))
  }

  if (!currentQuestion) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No quiz questions available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold">Bible Study Quiz</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium">{score}/{questions.length}</span>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg leading-relaxed">
              {currentQuestion.question}
            </CardTitle>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-1 rounded-full ${
                currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {currentQuestion.difficulty}
              </span>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Reference: {currentQuestion.verse_reference}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showExplanation}
                className={`w-full p-4 text-left rounded-lg border transition-all ${
                  selectedAnswer === index
                    ? showExplanation
                      ? index === currentQuestion.correct_answer
                        ? 'border-green-500 bg-green-50 text-green-800'
                        : 'border-red-500 bg-red-50 text-red-800'
                      : 'border-primary bg-primary/5'
                    : showExplanation && index === currentQuestion.correct_answer
                    ? 'border-green-500 bg-green-50 text-green-800'
                    : 'border-border hover:border-primary/50 hover:bg-accent'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {showExplanation && (
                    <>
                      {index === currentQuestion.correct_answer && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                      {selectedAnswer === index && index !== currentQuestion.correct_answer && (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                    </>
                  )}
                </div>
              </button>
            ))}
          </div>

          {showExplanation && (
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Explanation</h4>
              <p className="text-sm leading-relaxed">{currentQuestion.explanation}</p>
            </div>
          )}

          <div className="flex items-center justify-between pt-4">
            <Button
              variant="outline"
              onClick={handleRestart}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Restart Quiz
            </Button>

            <div className="flex items-center gap-2">
              {!showExplanation ? (
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswer === null}
                >
                  Submit Answer
                </Button>
              ) : (
                <Button onClick={handleNextQuestion}>
                  {isLastQuestion ? 'Complete Quiz' : 'Next Question'}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="w-full bg-muted rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{
            width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`
          }}
        />
      </div>
    </div>
  )
}