'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Play, Star } from 'lucide-react'

interface Game {
  id: string
  name: string
  type: string
  description?: string
  thumbnail?: string
}

const gameIcons: Record<string, string> = {
  SLOTS: '🎰',
  BLACKJACK: '♠️',
  ROULETTE: '🎡',
  VIDEO_POKER: '🃏',
  FISH: '🐟',
}

export default function GamesPage() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/games')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setGames(data)
        } else {
          setGames(defaultGames)
        }
      })
      .catch(() => setGames(defaultGames))
      .finally(() => setLoading(false))
  }, [])

  const defaultGames: Game[] = [
    { id: '1', name: 'Lucky Slots', type: 'SLOTS', description: 'Spin the reels and win big!' },
    { id: '2', name: 'Mega Jackpot', type: 'SLOTS', description: 'Hit the massive jackpot!' },
    { id: '3', name: 'Classic Blackjack', type: 'BLACKJACK', description: 'Beat the dealer!' },
    { id: '4', name: 'European Roulette', type: 'ROULETTE', description: 'Place your bets!' },
    { id: '5', name: 'Jacks or Better', type: 'VIDEO_POKER', description: 'Video poker classic' },
    { id: '6', name: 'Ocean Riches', type: 'FISH', description: 'Catch fish for coins!' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-heading mb-2">
          <span className="gold-gradient">Casino</span> Games
        </h1>
        <p className="text-gray-400">Choose your favorite game and start playing!</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {games.map((game) => (
          <Link
            key={game.id}
            href={`/games/${game.id}`}
            className="casino-card p-4 rounded-2xl group hover:border-yellow-500/50 transition-all"
          >
            <div className="aspect-square rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-6xl mb-3 group-hover:scale-105 transition-transform">
              {gameIcons[game.type] || '🎮'}
            </div>
            <h3 className="font-semibold mb-1">{game.name}</h3>
            <p className="text-sm text-gray-400 line-clamp-2">{game.description}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-400">
                {game.type.replace('_', ' ')}
              </span>
              <Play className="w-5 h-5 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
