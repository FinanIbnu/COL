"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Download, Share2, Twitter, Facebook, Copy } from 'lucide-react'

interface ShareableCardProps {
  result: any
  onClose: () => void
}

export function ShareableCard({ result, onClose }: ShareableCardProps) {
  const [copied, setCopied] = useState(false)

  const shareText = `🏆 ${result.winner} wins the epic battle! Check out this legendary face-off on History Face-Off! #HistoryFaceOff #EpicBattle`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareOnTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`
    window.open(url, '_blank')
  }

  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(shareText)}`
    window.open(url, '_blank')
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="bg-slate-800 border-slate-700 max-w-md w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Share Your Battle Result</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Result Preview */}
          <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-lg p-4 text-center">
            <div className="text-4xl mb-2">🏆</div>
            <h3 className="text-xl font-bold text-white mb-2">{result.winner}</h3>
            <p className="text-gray-300 text-sm">
              Wins the epic historical battle!
            </p>
            <div className="flex justify-center gap-4 mt-3 text-sm">
              <Badge variant="outline">
                Fighter 1: {result.fighter1Total} pts
              </Badge>
              <Badge variant="outline">
                Fighter 2: {result.fighter2Total} pts
              </Badge>
            </div>
          </div>

          {/* Share Options */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold">Share this epic battle:</h4>
            
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={shareOnTwitter}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Twitter className="mr-2 w-4 h-4" />
                Twitter
              </Button>
              
              <Button
                onClick={shareOnFacebook}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Facebook className="mr-2 w-4 h-4" />
                Facebook
              </Button>
            </div>

            <Button
              onClick={copyToClipboard}
              variant="outline"
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <Copy className="mr-2 w-4 h-4" />
              {copied ? "Copied!" : "Copy Link"}
            </Button>
          </div>

          {/* Download Option */}
          <div className="pt-4 border-t border-gray-600">
            <Button
              onClick={() => {/* Download functionality */}}
              variant="outline"
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <Download className="mr-2 w-4 h-4" />
              Download Result Card
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
