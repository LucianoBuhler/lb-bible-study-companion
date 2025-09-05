import React, { useState } from 'react'
import { BookOpen, MessageSquare, Link, Heart, Share, Copy } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card'
import { Button } from './ui/Button'
import { Verse, Commentary, CrossReference } from '../types/bible'
import { formatVerseReference } from '../lib/utils'

interface VerseCardProps {
  verse: Verse
  commentary?: Commentary[]
  crossReferences?: CrossReference[]
  relevanceScore?: number
  onAddNote?: (verseId: string) => void
  onViewCrossReferences?: (verseId: string) => void
}

export function VerseCard({
  verse,
  commentary = [],
  crossReferences = [],
  relevanceScore,
  onAddNote,
  onViewCrossReferences
}: VerseCardProps) {
  const [showCommentary, setShowCommentary] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)

  const handleCopyVerse = async () => {
    const text = `${formatVerseReference(verse.book, verse.chapter, verse.verse)} - ${verse.text} (${verse.translation})`
    await navigator.clipboard.writeText(text)
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: formatVerseReference(verse.book, verse.chapter, verse.verse),
        text: verse.text,
        url: window.location.href
      })
    }
  }

  return (
    <Card className="study-card group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg font-semibold">
              {formatVerseReference(verse.book, verse.chapter, verse.verse)}
            </CardTitle>
            {relevanceScore && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                {Math.round(relevanceScore * 100)}% match
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFavorited(!isFavorited)}
              className="h-8 w-8"
            >
              <Heart className={`h-4 w-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopyVerse}
              className="h-8 w-8"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              className="h-8 w-8"
            >
              <Share className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="verse-text">
          "{verse.text}"
        </div>

        <div className="text-sm text-muted-foreground">
          {verse.translation}
        </div>

        <div className="flex flex-wrap gap-2">
          {commentary.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCommentary(!showCommentary)}
              className="flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              Commentary ({commentary.length})
            </Button>
          )}

          {crossReferences.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewCrossReferences?.(verse.id)}
              className="flex items-center gap-2"
            >
              <Link className="h-4 w-4" />
              Cross References ({crossReferences.length})
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddNote?.(verse.id)}
            className="flex items-center gap-2"
          >
            <BookOpen className="h-4 w-4" />
            Add Note
          </Button>
        </div>

        {showCommentary && commentary.length > 0 && (
          <div className="space-y-3 pt-3 border-t">
            <h4 className="font-medium text-sm">Commentary</h4>
            {commentary.map((comment) => (
              <div key={comment.id} className="commentary-text space-y-2">
                <div className="text-sm">
                  <span className="font-medium">{comment.author}</span>
                  {comment.source && (
                    <span className="text-muted-foreground"> - {comment.source}</span>
                  )}
                </div>
                <p className="text-sm leading-relaxed">{comment.text}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}