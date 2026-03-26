'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, RotateCcw, Coins, Star, Zap } from 'lucide-react'

interface Game {
  id: string
  name: string
  type: string
  description?: string
}

interface GameResult {
  reels: string[]
  wonAmount: number
  multiplier: number
  isWin: boolean
}

const symbols = ['🍒', '🍋', '🍇', '💎', '⭐', '🎰']

export default function GamePlayPage() {
  const params = useParams()
  const router = useRouter()
  const [game, setGame] = useState<Game | null>(null)
  const [reels, setReels] = useState<string[]>(['🍒', '🍒', '🍒'])
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState<GameResult | null>(null)
  const [betAmount, setBetAmount] = useState(10)
  const [currency, setCurrency] = useState<'GC' | 'SC'>('GC')
  const [balance, setBalance] = useState({ gc: 0, sc: 0 })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/wallet')
      .then(r => r.json())
      .then(data => setBalance({ gc: data.gcBalance || 0, sc: data.scBalance || 0 }))
      .finally(() => setLoading(false))
  }, [])

  const spin = async () => {
    if (spinning) return
    
    const currentBalance = currency === 'SC' ? balance.sc : balance.gc
    if (currentBalance < betAmount) {
      setMessage('Insufficient balance!')
      return
    }

    setSpinning(true)
    setMessage('')

    const newReels: string[] = []
    for (let i = 0; i < 3; i++) {
      await new Promise(r => setTimeout(r, 300 + i * 200))
      newReels.push(symbols[Math.floor(Math.random() * symbols.length)])
      setReels([...newReels, ...Array(3 - newReels.length).fill('❓')])
    }

    setReels(newReels)

    const isWin = newReels[0] === newReels[1] || newReels[1] === newReels[2] || newReels[0] === newReels[2]
    let multiplier = 0
    if (newReels[0] === newReels[1] && newReels[1] === newReels[2]) {
      multiplier = 10
    } else if (isWin) {
      multiplier = 2
    }

    const wonAmount = isWin ? betAmount * multiplier : 0

    setBalance(prev => ({
      ...prev,
      [currency.toLowerCase()]: prev[currency === 'SC' ? 'sc' : 'gc'] - betAmount + wonAmount
    }))

    setResult({ reels: newReels, wonAmount, multiplier, isWin })
    setSpinning(false)

    if (isWin) {
      setMessage(wonAmount > 0 ? `🎉 YOU WON ${wonAmount} ${currency}!` : 'Big Win!')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button
        onClick={() => router.push('/games')}
        className="flex items-center gap-2 text-gray-400 hover:text-white"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Games
      </button>

      <div className="casino-card p-6 rounded-2xl">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold font-heading">
            <span className="gold-gradient">Lucky Slots</span>
          </h1>
          <p className="text-gray-400">Match symbols to win!</p>
        </div>

        {/* Slot Machine Display */}
        <div className="bg-gradient-to-b from-gray-900 to-black rounded-2xl p-8 mb-6 border-4 border-yellow-500/30">
          <div className="flex justify-center gap-4">
            {reels.map((symbol, i) => (
              <div
                key={i}
                className={`w-24 h-28 rounded-xl flex items-center justify-center text-5xl bg-gray-800 border-2 ${
                  spinning ? 'border-gray-600' : 'border-yellow-500/50'
                }`}
              >
                {symbol}
              </div>
            ))}
          </div>
        </div>

        {/* Result Message */}
        {message && (
          <div className={`text-center mb-4 p-3 rounded-lg ${
            result?.isWin ? 'bg-green-500/20 text-green-400' : 'bg-gray-800 text-gray-400'
          }`}>
            {message}
          </div>
        )}

        {/* Controls */}
        <div className="space-y-4">
          {/* Bet Amount */}
          <div className="flex items-center justify-center gap-4">
            <span className="text-gray-400">Bet:</span>
            <div className="flex items-center gap-2">
              {[10, 50, 100, 500].map(amount => (
                <button
                  key={amount}
                  onClick={() => setBetAmount(amount)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                    betAmount === amount
                      ? 'bg-yellow-500 text-gray-900'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {amount}
                </button>
              ))}
            </div>
          </div>

          {/* Currency Selection */}
          <div className="flex items-center justify-center gap-4">
            <span className="text-gray-400">Currency:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrency('GC')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                  currency === 'GC'
                    ? 'bg-yellow-500 text-gray-900'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                <Coins className="w-4 h-4" />
                GC
              </button>
              <button
                onClick={() => setCurrency('SC')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                  currency === 'SC'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                <Star className="w-4 h-4" />
                SC
              </button>
            </div>
          </div>

          {/* Balance Display */}
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-yellow-400" />
              <span className="text-gray-400">GC:</span>
              <span className="text-yellow-400 font-semibold">{balance.gc.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-red-400" />
              <span className="text-gray-400">SC:</span>
              <span className="text-red-400 font-semibold">{balance.sc.toLocaleString()}</span>
            </div>
          </div>

          {/* Spin Button */}
          <button
            onClick={spin}
            disabled={spinning}
            className="w-full gold-button py-4 rounded-xl text-lg font-bold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {spinning ? (
              <RotateCcw className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <Zap className="w-6 h-6" />
                SPIN
              </>
            )}
          </button>
        </div>
      </div>

      {/* Paytable */}
      <div className="casino-card p-4 rounded-2xl">
        <h3 className="font-bold mb-3 text-center">Paytable</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center justify-between p-2 rounded bg-gray-800/30">
            <span>3 matching symbols</span>
            <span className="text-yellow-400 font-bold">10x</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded bg-gray-800/30">
            <span>2 matching symbols</span>
            <span className="text-yellow-400 font-bold">2x</span>
          </div>
        </div>
      </div>
    </div>
  )
}
