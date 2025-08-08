"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Trophy, Shuffle, Play } from 'lucide-react'
import { historicalFiguresDB } from "../data/historical-figures"

interface TournamentModeProps {
  memeMode: boolean
  onBackToHome: () => void
}

interface TournamentBracket {
  round: number
  matches: Array<{
    id: string
    fighter1: any
    fighter2: any
    winner?: any
  }>
}

export function TournamentMode({ memeMode, onBackToHome }: TournamentModeProps) {
  const [tournament, setTournament] = useState<TournamentBracket[]>([])
  const [currentRound, setCurrentRound] = useState(0)
  const [tournamentComplete, setTournamentComplete] = useState(false)
  const [champion, setChampion] = useState<any>(null)

  const generateTournament = () => {
    // Select 8 random fighters
    const shuffled = [...historicalFiguresDB].sort(() => 0.5 - Math.random())
    const fighters = shuffled.slice(0, 8)

    // Create first round matches
    const firstRound: TournamentBracket = {
      round: 1,
      matches: []
    }

    for (let i = 0; i < fighters.length; i += 2) {
      firstRound.matches.push({
        id: `r1-m${i/2}`,
        fighter1: fighters[i],
        fighter2: fighters[i + 1]
      })
    }

    setTournament([firstRound])
    setCurrentRound(0)
    setTournamentComplete(false)
    setChampion(null)
  }

  const simulateBattle = (fighter1: any, fighter2: any) => {
    const mode = memeMode ? "meme" : "realistic"
    const fighter1Total = Object.values(fighter1.stats[mode]).reduce((sum: number, val: any) => sum + val, 0)
    const fighter2Total = Object.values(fighter2.stats[mode]).reduce((sum: number, val: any) => sum + val, 0)
    
    return fighter1Total > fighter2Total ? fighter1 : fighter2
  }

  const playMatch = (roundIndex: number, matchIndex: number) => {
    const match = tournament[roundIndex].matches[matchIndex]
    const winner = simulateBattle(match.fighter1, match.fighter2)
    
    // Update the match with winner
    const updatedTournament = [...tournament]
    updatedTournament[roundIndex].matches[matchIndex].winner = winner
    setTournament(updatedTournament)

    // Check if round is complete
    const roundComplete = updatedTournament[roundIndex].matches.every(m => m.winner)
    
    if (roundComplete) {
      const winners = updatedTournament[roundIndex].matches.map(m => m.winner)
      
      if (winners.length === 1) {
        // Tournament complete
        setChampion(winners[0])
        setTournamentComplete(true)
      } else {
        // Create next round
        const nextRound: TournamentBracket = {
          round: roundIndex + 2,
          matches: []
        }

        for (let i = 0; i < winners.length; i += 2) {
          nextRound.matches.push({
            id: `r${roundIndex + 2}-m${i/2}`,
            fighter1: winners[i],
            fighter2: winners[i + 1]
          })
        }

        updatedTournament.push(nextRound)
        setTournament(updatedTournament)
        setCurrentRound(roundIndex + 1)
      }
    }
  }

  const playAllMatches = () => {
    const currentRoundMatches = tournament[currentRound].matches
    currentRoundMatches.forEach((_, index) => {
      setTimeout(() => {
        playMatch(currentRound, index)
      }, index * 1000)
    })
  }

  useEffect(() => {
    generateTournament()
  }, [])

  return (
    <div className="space-y-8">
      {/* Header */}
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
          <h1 className="text-3xl font-bold text-white mb-2">Tournament Mode</h1>
          <Badge variant={memeMode ? "destructive" : "secondary"}>
            {memeMode ? "MEME MODE 🔥" : "REALISTIC MODE"}
          </Badge>
        </div>
        
        <Button
          onClick={generateTournament}
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
        >
          <Shuffle className="mr-2 w-4 h-4" />
          New Tournament
        </Button>
      </div>

      {/* Tournament Champion */}
      {tournamentComplete && champion && (
        <Card className="bg-gradient-to-br from-yellow-900/50 to-orange-900/50 border-yellow-600">
          <CardHeader>
            <CardTitle className="text-center text-yellow-400 text-2xl">
              🏆 TOURNAMENT CHAMPION 🏆
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-6xl animate-bounce">👑</div>
            <img
              src={champion.avatar || `/placeholder.svg?height=120&width=120&text=${champion.name.split(' ')[0]}`}
              alt={champion.name}
              className="w-24 h-24 rounded-full mx-auto border-4 border-yellow-400"
            />
            <h2 className="text-2xl font-bold text-white">{champion.name}</h2>
            <p className="text-gray-300">{champion.title}</p>
            <Badge variant="outline">{champion.era}</Badge>
          </CardContent>
        </Card>
      )}

      {/* Tournament Bracket */}
      <div className="space-y-8">
        {tournament.map((round, roundIndex) => (
          <Card key={round.round} className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">
                  {round.round === 1 ? "Quarter Finals" :
                   round.round === 2 ? "Semi Finals" :
                   round.round === 3 ? "Finals" : `Round ${round.round}`}
                </CardTitle>
                
                {roundIndex === currentRound && !tournamentComplete && (
                  <Button
                    onClick={playAllMatches}
                    className="bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700"
                  >
                    <Play className="mr-2 w-4 h-4" />
                    Play All Matches
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {round.matches.map((match, matchIndex) => (
                  <Card key={match.id} className="bg-slate-700/50 border-slate-600">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        {/* Fighter 1 */}
                        <div className={`flex items-center gap-3 ${match.winner?.id === match.fighter1.id ? 'opacity-100' : match.winner ? 'opacity-50' : 'opacity-100'}`}>
                          <img
                            src={match.fighter1.avatar || `/placeholder.svg?height=40&width=40&text=${match.fighter1.name.split(' ')[0]}`}
                            alt={match.fighter1.name}
                            className="w-10 h-10 rounded-full border-2 border-yellow-400"
                          />
                          <div>
                            <h4 className="font-semibold text-white text-sm">{match.fighter1.name}</h4>
                            <p className="text-xs text-gray-400">{match.fighter1.title}</p>
                          </div>
                          {match.winner?.id === match.fighter1.id && (
                            <Trophy className="w-5 h-5 text-yellow-400" />
                          )}
                        </div>

                        {/* VS / Battle Button */}
                        <div className="text-center">
                          {match.winner ? (
                            <Badge variant="secondary">Complete</Badge>
                          ) : roundIndex === currentRound ? (
                            <Button
                              onClick={() => playMatch(roundIndex, matchIndex)}
                              size="sm"
                              className="bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700"
                            >
                              BATTLE
                            </Button>
                          ) : (
                            <span className="text-gray-400 text-sm">VS</span>
                          )}
                        </div>

                        {/* Fighter 2 */}
                        <div className={`flex items-center gap-3 ${match.winner?.id === match.fighter2.id ? 'opacity-100' : match.winner ? 'opacity-50' : 'opacity-100'}`}>
                          {match.winner?.id === match.fighter2.id && (
                            <Trophy className="w-5 h-5 text-yellow-400" />
                          )}
                          <div className="text-right">
                            <h4 className="font-semibold text-white text-sm">{match.fighter2.name}</h4>
                            <p className="text-xs text-gray-400">{match.fighter2.title}</p>
                          </div>
                          <img
                            src={match.fighter2.avatar || `/placeholder.svg?height=40&width=40&text=${match.fighter2.name.split(' ')[0]}`}
                            alt={match.fighter2.name}
                            className="w-10 h-10 rounded-full border-2 border-blue-400"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tournament Progress */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Tournament Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-300">
              <span>Progress</span>
              <span>{tournamentComplete ? "Complete" : `Round ${currentRound + 1} of ${tournament.length}`}</span>
            </div>
            <Progress 
              value={tournamentComplete ? 100 : ((currentRound + 1) / Math.max(tournament.length, 1)) * 100} 
              className="h-2"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
