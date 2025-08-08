"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface CharacterCardProps {
  figure: any
  isSelected: boolean
  onSelect: (figure: any) => void
  memeMode: boolean
  showStats?: boolean
}

export function CharacterCard({ figure, isSelected, onSelect, memeMode, showStats = false }: CharacterCardProps) {
  const mode = memeMode ? "meme" : "realistic"
  const totalStats = Object.values(figure.stats[mode]).reduce((sum: number, val: any) => sum + val, 0)

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
        isSelected 
          ? "bg-gradient-to-br from-blue-900/50 to-purple-900/50 border-blue-500 shadow-lg shadow-blue-500/25" 
          : "bg-slate-800/50 border-slate-700 hover:bg-slate-700/50"
      }`}
      onClick={() => onSelect(figure)}
    >
      <CardContent className="p-4">
        <div className="text-center space-y-3">
          <div className="relative">
            <img
              src={figure.avatar || `/placeholder.svg?height=80&width=80&text=${figure.name.split(' ')[0]}`}
              alt={figure.name}
              className={`w-16 h-16 rounded-full mx-auto border-2 ${
                isSelected ? "border-blue-400" : "border-gray-600"
              }`}
            />
            {isSelected && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            )}
          </div>
          
          <div>
            <h3 className="font-semibold text-white text-sm mb-1">{figure.name}</h3>
            <p className="text-xs text-gray-400 mb-2">{figure.title}</p>
            <div className="flex flex-wrap gap-1 justify-center">
              <Badge variant="outline" className="text-xs">
                {figure.era}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {figure.country}
              </Badge>
            </div>
          </div>

          {showStats && (
            <div className="space-y-2 pt-2 border-t border-gray-600">
              <div className="text-xs text-gray-300">
                <strong>Power Level:</strong> {totalStats}/70
              </div>
              <Progress value={(totalStats / 70) * 100} className="h-1" />
              <div className="text-xs text-gray-400">
                {figure.knownFor}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
