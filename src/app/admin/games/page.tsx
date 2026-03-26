'use client'

import { useEffect, useState } from 'react'
import { Gamepad2, Plus, Edit2, ToggleLeft, ToggleRight } from 'lucide-react'

export default function AdminGamesPage() {
  const [games, setGames] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/games')
      .then(res => res.json())
      .then(setGames)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const toggleGame = async (gameId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
    await fetch('/api/admin/games', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gameId, status: newStatus }),
    })
    setGames(games.map(g => g.id === gameId ? { ...g, status: newStatus } : g))
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
    </div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-heading">
          <span className="text-purple-400">Game</span> Management
        </h1>
      </div>

      <div className="grid gap-4">
        {games.map((game) => (
          <div key={game.id} className="bg-gray-800/50 p-4 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center text-2xl">
                🎮
              </div>
              <div>
                <h3 className="font-semibold">{game.name}</h3>
                <p className="text-sm text-gray-400">{game.type} • RTP: {(game.rtp * 100).toFixed(0)}%</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className={`px-2 py-1 rounded-full text-xs ${
                game.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {game.status}
              </span>
              <button
                onClick={() => toggleGame(game.id, game.status)}
                className="p-2 rounded-lg hover:bg-gray-700"
              >
                {game.status === 'active' ? (
                  <ToggleRight className="w-6 h-6 text-green-400" />
                ) : (
                  <ToggleLeft className="w-6 h-6 text-gray-400" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
