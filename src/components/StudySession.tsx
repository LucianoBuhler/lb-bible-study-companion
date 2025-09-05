import React, { useState } from 'react'
import { Save, Download, Trash2, Edit3, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { StudySession as StudySessionType, SearchResult } from '../types/bible'
import { VerseCard } from './VerseCard'

interface StudySessionProps {
  session: StudySessionType
  results: SearchResult[]
  onSave?: (session: StudySessionType) => void
  onExport?: (session: StudySessionType) => void
  onDelete?: (sessionId: string) => void
}

export function StudySession({
  session,
  results,
  onSave,
  onExport,
  onDelete
}: StudySessionProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(session.title)
  const [notes, setNotes] = useState(session.notes)

  const handleSave = () => {
    if (onSave) {
      onSave({
        ...session,
        title,
        notes,
        updated_at: new Date().toISOString()
      })
    }
    setIsEditing(false)
  }

  const handleExport = () => {
    if (onExport) {
      onExport(session)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-2">
              {isEditing ? (
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-xl font-semibold"
                  placeholder="Study session title..."
                />
              ) : (
                <CardTitle className="text-xl">{title}</CardTitle>
              )}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Created: {new Date(session.created_at).toLocaleDateString()}</span>
                {session.updated_at !== session.created_at && (
                  <span>• Updated: {new Date(session.updated_at).toLocaleDateString()}</span>
                )}
              </div>
              <div className="text-sm">
                <span className="font-medium">Query:</span> "{session.query}"
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <Button onClick={handleSave} size="sm">
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    size="sm"
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                    size="sm"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleExport}
                    size="sm"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => onDelete?.(session.id)}
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Study Notes</label>
              {isEditing ? (
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full min-h-[100px] p-3 border border-input rounded-md bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Add your study notes here..."
                />
              ) : (
                <div className="p-3 bg-muted rounded-md min-h-[60px]">
                  {notes || <span className="text-muted-foreground italic">No notes added yet</span>}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Search Results ({results.length})</h3>
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
  )
}