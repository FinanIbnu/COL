"use client"

import { useState, useEffect, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Globe3D } from "./components/Globe3D"
import { BattleArena } from "./components/BattleArena"
import { TournamentMode } from "./components/TournamentMode"
import { CharacterCard } from "./components/CharacterCard"
import { RandomMatchGenerator } from "./components/RandomMatchGenerator"
import { ShareableCard } from "./components/ShareableCard"
import { historicalFiguresDB, getRandomFighters, searchFigures } from "./data/historical-figures"
import { Shuffle, Search, Trophy, Globe, Swords, Users } from 'lucide-react'

export default function HistoryFaceOff() {
  const [currentView, setCurrentView] = useState("home") // home, globe, battle, tournament
  const [selectedFighter1, setSelectedFighter1] = useState(null)
  const [selectedFighter2, setSelectedFighter2] = useState(null)
  const [memeMode, setMemeMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [battleResult, setBattleResult] = useState(null)
  const [showShareCard, setShowShareCard] = useState(false)

  const handleRandomMatch = () => {
    const [fighter1, fighter2] = getRandomFighters()
    setSelectedFighter1(fighter1)
    setSelectedFighter2(fighter2)
    setCurrentView("battle")
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const filteredFigures = searchFigures(searchQuery)

  const startBattle = () => {
    if (selectedFighter1 && selectedFighter2) {
      setCurrentView("battle")
    }
  }

  const handleBattleComplete = (result: any) => {
    setBattleResult(result)
    setShowShareCard(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-yellow-400 via-red-500 to-purple-600 bg-clip-text text-transparent">
                ⚔️ History Face-Off
              </h1>
              <Badge variant="secondary" className="hidden md:inline-flex">
                v2.0
              </Badge>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Mode Toggle */}
              <div className="flex items-center gap-2">
                <Label htmlFor="mode-toggle" className="text-sm text-gray-300 hidden md:block">
                  Realistic
                </Label>
                <Switch
                  id="mode-toggle"
                  checked={memeMode}
                  onCheckedChange={setMemeMode}
                  className="data-[state=checked]:bg-pink-500"
                />
                <Label htmlFor="mode-toggle" className="text-sm text-pink-400 hidden md:block">
                  Meme 🔥
                </Label>
              </div>

              {/* Navigation */}
              <div className="flex gap-2">
                <Button
                  variant={currentView === "home" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentView("home")}
                  className="text-white"
                >
                  <Users className="w-4 h-4 md:mr-2" />
                  <span className="hidden md:inline">Home</span>
                </Button>
                <Button
                  variant={currentView === "globe" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentView("globe")}
                  className="text-white"
                >
                  <Globe className="w-4 h-4 md:mr-2" />
                  <span className="hidden md:inline">Globe</span>
                </Button>
                <Button
                  variant={currentView === "tournament" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentView("tournament")}
                  className="text-white"
                >
                  <Trophy className="w-4 h-4 md:mr-2" />
                  <span className="hidden md:inline">Tournament</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {currentView === "home" && (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-6">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
                Epic Historical Battles
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Pit history's greatest figures against each other in epic face-offs. 
                Compare stats, witness battles, and discover who would win in the ultimate showdown!
              </p>
              
              {/* Quick Actions */}
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  onClick={handleRandomMatch}
                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-6 py-3"
                >
                  <Shuffle className="mr-2 w-5 h-5" />
                  Random Match
                </Button>
                <Button
                  onClick={() => setCurrentView("globe")}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3"
                >
                  <Globe className="mr-2 w-5 h-5" />
                  Explore Globe
                </Button>
                <Button
                  onClick={() => setCurrentView("tournament")}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3"
                >
                  <Trophy className="mr-2 w-5 h-5" />
                  Tournament
                </Button>
              </div>
            </div>

            {/* Search Section */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Search Historical Figures
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input
                    placeholder="Search for Napoleon, Cleopatra, Einstein..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                  />
                  
                  {/* Search Results */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                    {filteredFigures.slice(0, 12).map((figure) => (
                      <CharacterCard
                        key={figure.id}
                        figure={figure}
                        isSelected={selectedFighter1?.id === figure.id || selectedFighter2?.id === figure.id}
                        onSelect={(fig) => {
                          if (!selectedFighter1) {
                            setSelectedFighter1(fig)
                          } else if (!selectedFighter2) {
                            setSelectedFighter2(fig)
                          } else {
                            setSelectedFighter1(fig)
                            setSelectedFighter2(null)
                          }
                        }}
                        memeMode={memeMode}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Selected Fighters */}
            {(selectedFighter1 || selectedFighter2) && (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Selected Fighters</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-yellow-400 mb-4">Fighter 1</h3>
                      {selectedFighter1 ? (
                        <CharacterCard
                          figure={selectedFighter1}
                          isSelected={true}
                          onSelect={() => setSelectedFighter1(null)}
                          memeMode={memeMode}
                          showStats={true}
                        />
                      ) : (
                        <div className="h-48 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center text-gray-400">
                          Select Fighter 1
                        </div>
                      )}
                    </div>
                    
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-blue-400 mb-4">Fighter 2</h3>
                      {selectedFighter2 ? (
                        <CharacterCard
                          figure={selectedFighter2}
                          isSelected={true}
                          onSelect={() => setSelectedFighter2(null)}
                          memeMode={memeMode}
                          showStats={true}
                        />
                      ) : (
                        <div className="h-48 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center text-gray-400">
                          Select Fighter 2
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {selectedFighter1 && selectedFighter2 && (
                    <div className="text-center mt-6">
                      <Button
                        onClick={startBattle}
                        className="bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 text-white px-8 py-3 text-lg font-bold"
                      >
                        <Swords className="mr-2" />
                        START BATTLE!
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Random Match Generator */}
            <RandomMatchGenerator onMatchGenerated={handleRandomMatch} />
          </div>
        )}

        {currentView === "globe" && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                🌍 Explore Historical Figures by Region
              </h2>
              <p className="text-gray-300">
                Click on any country to discover legendary figures from that region
              </p>
            </div>
            
            <Suspense fallback={
              <div className="h-96 bg-slate-800/50 rounded-lg flex items-center justify-center">
                <div className="text-white">Loading 3D Globe...</div>
              </div>
            }>
              <Globe3D
                onCountrySelect={(country, figures) => {
                  // Handle country selection and show figures
                  console.log(`Selected ${country}:`, figures)
                }}
                onFigureSelect={(figure) => {
                  if (!selectedFighter1) {
                    setSelectedFighter1(figure)
                  } else if (!selectedFighter2) {
                    setSelectedFighter2(figure)
                  } else {
                    setSelectedFighter1(figure)
                    setSelectedFighter2(null)
                  }
                }}
              />
            </Suspense>
          </div>
        )}

        {currentView === "battle" && selectedFighter1 && selectedFighter2 && (
          <BattleArena
            fighter1={selectedFighter1}
            fighter2={selectedFighter2}
            memeMode={memeMode}
            onBattleComplete={handleBattleComplete}
            onBackToHome={() => setCurrentView("home")}
          />
        )}

        {currentView === "tournament" && (
          <TournamentMode
            memeMode={memeMode}
            onBackToHome={() => setCurrentView("home")}
          />
        )}
      </main>

      {/* Shareable Card Modal */}
      {showShareCard && battleResult && (
        <ShareableCard
          result={battleResult}
          onClose={() => setShowShareCard(false)}
        />
      )}
    </div>
  )
}
