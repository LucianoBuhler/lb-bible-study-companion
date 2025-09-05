import React, { useState } from 'react'
import { BookOpen, Brain, History, Settings } from 'lucide-react'
import { SearchBar, SearchType } from './components/SearchBar'
import { VerseCard } from './components/VerseCard'
import { QuizMode } from './components/QuizMode'
import { StudySession } from './components/StudySession'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/Tabs'
import { Button } from './components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/Card'
import { useBibleSearch } from './hooks/useBibleSearch'
import { useQuizGeneration } from './hooks/useQuizGeneration'
import { StudySession as StudySessionType } from './types/bible'

function App() {
  const [activeTab, setActiveTab] = useState('search')
  const [studySessions, setStudySessions] = useState<StudySessionType[]>([])
  const [currentSession, setCurrentSession] = useState<StudySessionType | null>(null)

  const { search, results, isLoading, error } = useBibleSearch()
  const { generateQuiz, questions, isGenerating } = useQuizGeneration()

  const handleSearch = async (query: string, type: SearchType) => {
    await search(query, type)
    
    // Create a new study session
    const newSession: StudySessionType = {
      id: Date.now().toString(),
      user_id: 'demo-user',
      title: `Study: ${query}`,
      query,
      results: [],
      notes: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    setCurrentSession(newSession)
    setActiveTab('study')
  }

  const handleGenerateQuiz = async () => {
    await generateQuiz('general', undefined, 5)
    setActiveTab('quiz')
  }

  const handleSaveSession = (session: StudySessionType) => {
    const updatedSessions = studySessions.filter(s => s.id !== session.id)
    setStudySessions([...updatedSessions, session])
    setCurrentSession(session)
  }

  const handleQuizComplete = (score: number, total: number) => {
    alert(`Quiz completed! You scored ${score} out of ${total} (${Math.round((score / total) * 100)}%)`)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <BookOpen className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Bible Study Companion</h1>
                <p className="text-sm text-muted-foreground">Advanced Biblical Research & Study Tool</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="search" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Search
            </TabsTrigger>
            <TabsTrigger value="study" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Study Session
            </TabsTrigger>
            <TabsTrigger value="quiz" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Quiz Mode
            </TabsTrigger>
            <TabsTrigger value="sessions" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Saved Sessions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold tracking-tight">Explore Scripture with AI-Powered Insights</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Search verses, discover cross-references, explore commentary, and deepen your understanding 
                with our advanced Bible study companion.
              </p>
            </div>

            <SearchBar onSearch={handleSearch} isLoading={isLoading} />

            {error && (
              <Card className="border-destructive">
                <CardContent className="pt-6">
                  <p className="text-destructive text-center">{error}</p>
                </CardContent>
              </Card>
            )}

            {results.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Search Results ({results.length})</h3>
                  <Button onClick={handleGenerateQuiz} variant="outline">
                    <Brain className="h-4 w-4 mr-2" />
                    Generate Quiz
                  </Button>
                </div>
                <div className="space-y-4">
                  {results.map((result, index) => (
                    <VerseCard
                      key={`${result.verse.id}-${index}`}
                      verse={result.verse}
                      commentary={result.commentary}
                      relevanceScore={result.relevance_score}
                    />
                  ))}
                </div>
              </div>
            )}

            {!isLoading && results.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Start Your Bible Study Journey</h3>
                  <p className="text-muted-foreground mb-6">
                    Use the search bar above to find verses, explore topics, or discover cross-references.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Button
                      variant="outline"
                      onClick={() => handleSearch('love', 'topic')}
                      size="sm"
                    >
                      Explore "Love"
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleSearch('John 3:16', 'verse')}
                      size="sm"
                    >
                      John 3:16
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleSearch('forgiveness', 'topic')}
                      size="sm"
                    >
                      Forgiveness
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="study">
            {currentSession ? (
              <StudySession
                session={currentSession}
                results={results}
                onSave={handleSaveSession}
                onExport={(session) => {
                  // Mock export functionality
                  const content = `# ${session.title}\n\nQuery: ${session.query}\n\nNotes: ${session.notes}`
                  const blob = new Blob([content], { type: 'text/markdown' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `${session.title}.md`
                  a.click()
                }}
              />
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <History className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Active Study Session</h3>
                  <p className="text-muted-foreground mb-6">
                    Start a search to begin a new study session.
                  </p>
                  <Button onClick={() => setActiveTab('search')}>
                    <BookOpen className="h-4 w-4 mr-2" />
                    Start Searching
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="quiz">
            {questions.length > 0 ? (
              <QuizMode questions={questions} onComplete={handleQuizComplete} />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-6 w-6" />
                    Bible Study Quiz
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-muted-foreground">
                    Test your biblical knowledge with AI-generated questions based on your study topics.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      onClick={() => generateQuiz('general', 'easy', 5)}
                      disabled={isGenerating}
                      className="flex-1"
                    >
                      {isGenerating ? 'Generating...' : 'Easy Quiz (5 questions)'}
                    </Button>
                    <Button
                      onClick={() => generateQuiz('general', 'medium', 5)}
                      disabled={isGenerating}
                      variant="outline"
                      className="flex-1"
                    >
                      {isGenerating ? 'Generating...' : 'Medium Quiz (5 questions)'}
                    </Button>
                    <Button
                      onClick={() => generateQuiz('general', 'hard', 5)}
                      disabled={isGenerating}
                      variant="outline"
                      className="flex-1"
                    >
                      {isGenerating ? 'Generating...' : 'Hard Quiz (5 questions)'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="sessions">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Saved Study Sessions</h2>
                <Button variant="outline">
                  <History className="h-4 w-4 mr-2" />
                  Import Session
                </Button>
              </div>

              {studySessions.length > 0 ? (
                <div className="grid gap-4">
                  {studySessions.map((session) => (
                    <Card key={session.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{session.title}</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                              Query: "{session.query}"
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              Created: {new Date(session.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setCurrentSession(session)
                              setActiveTab('study')
                            }}
                          >
                            Open
                          </Button>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <History className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No Saved Sessions</h3>
                    <p className="text-muted-foreground mb-6">
                      Your saved study sessions will appear here.
                    </p>
                    <Button onClick={() => setActiveTab('search')}>
                      <BookOpen className="h-4 w-4 mr-2" />
                      Start Your First Study
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/50 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>Bible Study Companion - Powered by AI for deeper scriptural understanding</p>
            <p className="mt-2">Built with React, TypeScript, and modern web technologies</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App