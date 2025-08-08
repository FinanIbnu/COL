"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts'
import { ArrowLeft, Volume2, Trophy, Share2, Info } from 'lucide-react'

const statCategories = [
  { key: "physicalStrength", label: "Physical Strength", icon: "💪", color: "#ef4444" },
  { key: "intelligence", label: "Intelligence", icon: "🧠", color: "#8b5cf6" },
  { key: "charisma", label: "Charisma", icon: "✨", color: "#06b6d4" },
  { key: "strategicAbility", label: "Strategic Ability", icon: "♟️", color: "#10b981" },
  { key: "emotionalResilience", label: "Emotional Resilience", icon: "🛡️", color: "#3b82f6" },
  { key: "legacy", label: "Legacy", icon: "👑", color: "#ec4899" },
  { key: "aggression", label: "Aggression", icon: "⚔️", color: "#dc2626" }
]

const tooltips = {
  physicalStrength: "Based on documented physical activities, military service, and health records",
  intelligence: "Academic achievements, problem-solving abilities, and intellectual contributions",
  charisma: "Ability to inspire, lead, and influence others through personality",
  strategicAbility: "Military tactics, political maneuvering, and long-term planning abilities",
  emotionalResilience: "Ability to overcome adversity, trauma, and maintain composure under pressure",
  legacy: "Lasting impact on history, culture, and modern society",
  aggression: "Tendency toward conflict, warfare, and forceful action"
}

interface BattleArenaProps {
  fighter1: any
  fighter2: any
  memeMode: boolean
  onBattleComplete: (result: any) => void
  onBackToHome: () => void
}

export function BattleArena({ fighter1, fighter2, memeMode, onBattleComplete, onBackToHome }: BattleArenaProps) {
  const [battlePhase, setBattlePhase] = useState("intro") // intro, battle, results
  const [winner, setWinner] = useState("")
  const [battleStats, setBattleStats] = useState<any>(null)
  const [voiceoverPlaying, setVoiceoverPlaying] = useState(false)

  useEffect(() => {
    // Battle intro sequence
    const timer = setTimeout(() => {
      setBattlePhase("battle")
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const getRadarData = () => {
    const mode = memeMode ? "meme" : "realistic"
    return statCategories.map(category => ({
      category: category.label,
      [fighter1.name]: fighter1.stats[mode][category.key],
      [fighter2.name]: fighter2.stats[mode][category.key]
    }))
  }

  const calculateWinner = () => {
    const mode = memeMode ? "meme" : "realistic"
    const fighter1Total = Object.values(fighter1.stats[mode]).reduce((sum: number, val: any) => sum + val, 0)
    const fighter2Total = Object.values(fighter2.stats[mode]).reduce((sum: number, val: any) => sum + val, 0)

    const result = {
      winner: fighter1Total > fighter2Total ? fighter1.name : 
              fighter2Total > fighter1Total ? fighter2.name : "It's a tie!",
      fighter1Total,
      fighter2Total,
      breakdown: statCategories.map(cat => ({
        category: cat.label,
        fighter1Score: fighter1.stats[mode][cat.key],
        fighter2Score: fighter2.stats[mode][cat.key],
        winner: fighter1.stats[mode][cat.key] > fighter2.stats[mode][cat.key] ? fighter1.name :
                fighter2.stats[mode][cat.key] > fighter1.stats[mode][cat.key] ? fighter2.name : "Tie"
      }))
    }

    setWinner(result.winner)
    setBattleStats(result)
    setBattlePhase("results")
    onBattleComplete(result)
  }

  const playVoiceover = (text: string) => {
    setVoiceoverPlaying(true)
    // Simulate voiceover
    setTimeout(() => setVoiceoverPlaying(false), 2000)
  }

  if (battlePhase === "intro") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center animate-pulse">
          <div className="text-6xl font-bold text-white mb-8 animate-bounce">
            ⚔️ EPIC BATTLE INCOMING ⚔️
          </div>
          <div className="flex items-center justify-center gap-8 mb-8">
            <div className="text-center">
              <img
                src={fighter1.avatar || "/placeholder.svg?height=120&width=120&text=" + fighter1.name.split(' ')[0]}
                alt={fighter1.name}
                className="w-32 h-32 rounded-full border-4 border-yellow-400 mb-4 animate-pulse"
              />
              <h2 className="text-2xl text-yellow-400 font-bold">{fighter1.name}</h2>
              <p className="text-gray-300">{fighter1.title}</p>
            </div>
            <div className="text-6xl animate-spin">⚡</div>
            <div className="text-center">
              <img
                src={fighter2.avatar || "/placeholder.svg?height=120&width=120&text=" + fighter2.name.split(' ')[0]}
                alt={fighter2.name}
                className="w-32 h-32 rounded-full border-4 border-blue-400 mb-4 animate-pulse"
              />
              <h2 className="text-2xl text-blue-400 font-bold">{fighter2.name}</h2>
              <p className="text-gray-300">{fighter2.title}</p>
            </div>
          </div>
          <div className="text-xl text-gray-300">
            Analyzing historical data and preparing for battle...
          </div>
          <div className="mt-4">
            <Progress value={66} className="w-64 mx-auto" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="space-y-8">
        {/* Battle Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={onBackToHome}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Home
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Battle Arena</h1>
            <Badge variant={memeMode ? "destructive" : "secondary"}>
              {memeMode ? "MEME MODE 🔥" : "REALISTIC MODE"}
            </Badge>
          </div>
          
          <Button
            variant="ghost"
            onClick={() => playVoiceover("Let the battle begin!")}
            className="text-white hover:bg-white/10"
            disabled={voiceoverPlaying}
          >
            <Volume2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Fighters Display */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-gradient-to-br from-yellow-900/50 to-orange-900/50 border-yellow-600">
            <CardHeader>
              <CardTitle className="text-yellow-400 text-center">
                {fighter1.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <img
                src={fighter1.avatar || "/placeholder.svg?height=150&width=150&text=" + fighter1.name.split(' ')[0]}
                alt={fighter1.name}
                className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-yellow-400"
              />
              <p className="text-gray-300 mb-2">{fighter1.title}</p>
              <Badge variant="outline" className="mb-4">{fighter1.era}</Badge>
              <div className="space-y-2 text-sm text-gray-300">
                <p><strong>Country:</strong> {fighter1.country}</p>
                <p><strong>Known for:</strong> {fighter1.knownFor}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 border-blue-600">
            <CardHeader>
              <CardTitle className="text-blue-400 text-center">
                {fighter2.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <img
                src={fighter2.avatar || "/placeholder.svg?height=150&width=150&text=" + fighter2.name.split(' ')[0]}
                alt={fighter2.name}
                className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-blue-400"
              />
              <p className="text-gray-300 mb-2">{fighter2.title}</p>
              <Badge variant="outline" className="mb-4">{fighter2.era}</Badge>
              <div className="space-y-2 text-sm text-gray-300">
                <p><strong>Country:</strong> {fighter2.country}</p>
                <p><strong>Known for:</strong> {fighter2.knownFor}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Radar Chart */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-center text-white">
              Battle Stats Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={getRadarData()}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="category" className="text-xs fill-gray-300" />
                  <PolarRadiusAxis domain={[0, 12]} className="text-xs fill-gray-400" />
                  <Radar
                    name={fighter1.name}
                    dataKey={fighter1.name}
                    stroke="#fbbf24"
                    fill="#fbbf24"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Radar
                    name={fighter2.name}
                    dataKey={fighter2.name}
                    stroke="#60a5fa"
                    fill="#60a5fa"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {statCategories.map((category) => {
            const mode = memeMode ? "meme" : "realistic"
            const stat1 = fighter1.stats[mode][category.key]
            const stat2 = fighter2.stats[mode][category.key]

            return (
              <Card key={category.key} className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{category.icon}</span>
                      <h4 className="font-semibold text-white text-sm">{category.label}</h4>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-3 h-3 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-slate-700 text-white border-slate-600">
                          <p className="max-w-xs text-xs">{tooltips[category.key as keyof typeof tooltips]}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-yellow-400 text-xs">{fighter1.name}</span>
                      <span className="text-yellow-400 font-bold text-sm">{stat1}/10</span>
                    </div>
                    <Progress value={(stat1 / 10) * 100} className="h-2" />
                    <div className="flex items-center justify-between">
                      <span className="text-blue-400 text-xs">{fighter2.name}</span>
                      <span className="text-blue-400 font-bold text-sm">{stat2}/10</span>
                    </div>
                    <Progress value={(stat2 / 10) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Battle Action */}
        {battlePhase === "battle" && (
          <div className="text-center">
            <Button
              onClick={calculateWinner}
              className="bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 text-white px-8 py-4 text-xl font-bold"
            >
              <Trophy className="mr-2 w-6 h-6" />
              DETERMINE WINNER!
            </Button>
          </div>
        )}

        {/* Battle Results */}
        {battlePhase === "results" && battleStats && (
          <Card className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-purple-600">
            <CardHeader>
              <CardTitle className="text-center text-white text-3xl">
                🏆 BATTLE RESULTS 🏆
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="text-6xl animate-bounce">👑</div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                {winner}
              </h2>
              <p className="text-xl text-gray-300">
                {winner === "It's a tie!" 
                  ? "An epic stalemate! Both legends are equally matched!" 
                  : `${winner} emerges victorious in this legendary clash!`}
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 text-left">
                <div>
                  <h3 className="text-lg font-semibold text-yellow-400 mb-2">
                    {fighter1.name}: {battleStats.fighter1Total} points
                  </h3>
                  <div className="space-y-1">
                    {battleStats.breakdown.map((stat: any, index: number) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-300">{stat.category}:</span>
                        <span className={stat.winner === fighter1.name ? "text-green-400 font-bold" : "text-gray-400"}>
                          {stat.fighter1Score}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-blue-400 mb-2">
                    {fighter2.name}: {battleStats.fighter2Total} points
                  </h3>
                  <div className="space-y-1">
                    {battleStats.breakdown.map((stat: any, index: number) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-300">{stat.category}:</span>
                        <span className={stat.winner === fighter2.name ? "text-green-400 font-bold" : "text-gray-400"}>
                          {stat.fighter2Score}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Button
                  onClick={onBackToHome}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  New Battle
                </Button>
                <Button
                  onClick={() => {/* Share functionality */}}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  <Share2 className="mr-2 w-4 h-4" />
                  Share Result
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </TooltipProvider>
  )
}
