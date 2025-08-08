"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shuffle, Zap, Clock } from 'lucide-react'
import { getRandomFighters } from "../data/historical-figures"

interface RandomMatchGeneratorProps {
  onMatchGenerated: () => void
}

const funMatchups = [
  {
    title: "Ancient vs Modern",
    description: "Cleopatra vs. Steve Jobs",
    icon: "🏛️💻"
  },
  {
    title: "Warriors vs Thinkers",
    description: "Napoleon vs. Einstein",
    icon: "⚔️🧠"
  },
  {
    title: "East vs West",
    description: "Gandhi vs. Churchill",
    icon: "🌅🌇"
  },
  {
    title: "Artists vs Leaders",
    description: "Leonardo da Vinci vs. Julius Caesar",
    icon: "🎨👑"
  }
]

export function RandomMatchGenerator({ onMatchGenerated }: RandomMatchGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [lastMatch, setLastMatch] = useState<any>(null)

  const generateRandomMatch = () => {
    setIsGenerating(true)
    
    // Simulate loading time for dramatic effect
    setTimeout(() => {
      const [fighter1, fighter2] = getRandomFighters()
      setLastMatch({ fighter1, fighter2 })
      setIsGenerating(false)
      onMatchGenerated()
    }, 2000)
  }

  return (
    <Card className="bg-gradient-to-br from-orange-900/50 to-red-900/50 border-orange-600">
      <CardHeader>
        <CardTitle className="text-orange-400 flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Random Match Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-gray-300">
          Let fate decide! Generate epic matchups between historical figures from different eras, 
          cultures, and backgrounds for truly unexpected battles.
        </p>

        {/* Fun Matchup Examples */}
        <div className="grid grid-cols-2 gap-3">
          {funMatchups.map((matchup, index) => (
            <div key={index} className="bg-slate-800/50 rounded-lg p-3 text-center">
              <div className="text-2xl mb-1">{matchup.icon}</div>
              <h4 className="text-sm font-semibold text-white">{matchup.title}</h4>
              <p className="text-xs text-gray-400">{matchup.description}</p>
            </div>
          ))}
        </div>

        {/* Generate Button */}
        <div className="text-center">
          <Button
            onClick={generateRandomMatch}
            disabled={isGenerating}
            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 py-3 text-lg font-bold"
          >
            {isGenerating ? (
              <>
                <Clock className="mr-2 w-5 h-5 animate-spin" />
                Generating Epic Match...
              </>
            ) : (
              <>
                <Shuffle className="mr-2 w-5 h-5" />
                Generate Random Match
              </>
            )}
          </Button>
        </div>

        {/* Last Generated Match */}
        {lastMatch && !isGenerating && (
          <div className="bg-slate-800/50 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-3 text-center">Last Generated Match</h4>
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <img
                  src={lastMatch.fighter1.avatar || `/placeholder.svg?height=60&width=60&text=${lastMatch.fighter1.name.split(' ')[0]}`}
                  alt={lastMatch.fighter1.name}
                  className="w-12 h-12 rounded-full mx-auto mb-2 border-2 border-yellow-400"
                />
                <p className="text-sm text-yellow-400 font-semibold">{lastMatch.fighter1.name}</p>
                <Badge variant="outline" className="text-xs">{lastMatch.fighter1.era}</Badge>
              </div>
              
              <div className="text-2xl">⚡</div>
              
              <div className="text-center">
                <img
                  src={lastMatch.fighter2.avatar || `/placeholder.svg?height=60&width=60&text=${lastMatch.fighter2.name.split(' ')[0]}`}
                  alt={lastMatch.fighter2.name}
                  className="w-12 h-12 rounded-full mx-auto mb-2 border-2 border-blue-400"
                />
                <p className="text-sm text-blue-400 font-semibold">{lastMatch.fighter2.name}</p>
                <Badge variant="outline" className="text-xs">{lastMatch.fighter2.era}</Badge>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
