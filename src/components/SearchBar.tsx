import React, { useState } from 'react'
import { Search, Filter, BookOpen, MessageSquare, Brain } from 'lucide-react'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { cn } from '../lib/utils'

interface SearchBarProps {
  onSearch: (query: string, type: SearchType) => void
  isLoading?: boolean
}

export type SearchType = 'verse' | 'topic' | 'commentary' | 'cross-reference'

const searchTypes = [
  { type: 'verse' as SearchType, label: 'Verses', icon: BookOpen },
  { type: 'topic' as SearchType, label: 'Topics', icon: Brain },
  { type: 'commentary' as SearchType, label: 'Commentary', icon: MessageSquare },
  { type: 'cross-reference' as SearchType, label: 'Cross-Ref', icon: Filter },
]

export function SearchBar({ onSearch, isLoading = false }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [selectedType, setSelectedType] = useState<SearchType>('verse')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query.trim(), selectedType)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search for verses, topics, or themes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-24 h-12 text-lg"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={!query.trim() || isLoading}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
        </div>
      </form>

      <div className="flex flex-wrap gap-2 justify-center">
        {searchTypes.map(({ type, label, icon: Icon }) => (
          <Button
            key={type}
            variant={selectedType === type ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedType(type)}
            className={cn(
              "flex items-center gap-2 transition-all",
              selectedType === type && "shadow-md"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Button>
        ))}
      </div>

      <div className="text-center text-sm text-muted-foreground">
        <p>Try searching for: "parables about forgiveness", "John 3:16", or "love your enemies"</p>
      </div>
    </div>
  )
}