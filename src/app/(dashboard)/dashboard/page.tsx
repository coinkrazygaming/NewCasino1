'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Gamepad2, ShoppingCart, TrendingUp, Gift, Sparkles } from 'lucide-react'

export default function DashboardPage() {
  const { data: session } = useSession()
  const [stats, setStats] = useState({
    gcBalance: 0,
    scBalance: 0,
    totalBets: 0,
    totalWins: 0,
  })

  useEffect(() => {
    fetch('/api/wallet')
      .then(res => res.json())
      .then(data => setStats(prev => ({ ...prev, gcBalance: data.gcBalance || 0, scBalance: data.scBalance || 0 })))
      .catch(console.error)
  }, [])

  return (
    <div className="space-y-6">
      <div className="casino-card p-6 rounded-2xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, <span className="gold-gradient">{(session?.user?.name || 'Player')}</span>!
        </h1>
        <p className="text-gray-400">Ready to hit the jackpot today?</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="casino-card p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <span className="text-2xl">🪙</span>
              </div>
              <div>
                <p className="text-sm text-gray-400">Gold Coins</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.gcBalance.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <Link href="/store" className="block text-center py-2 rounded-lg bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 transition-colors">
            Buy More GC
          </Link>
        </div>

        <div className="casino-card p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                <span className="text-2xl">★</span>
              </div>
              <div>
                <p className="text-sm text-gray-400">Sweepstakes Coins</p>
                <p className="text-2xl font-bold text-red-400">{stats.scBalance.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <p className="text-center text-sm text-gray-500">
            <Gift className="w-4 h-4 inline mr-1" />
            100 SC = $100 USD value
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <Link href="/games" className="casino-card p-6 rounded-2xl text-center hover:border-yellow-500/50 transition-all">
            <Gamepad2 className="w-10 h-10 mx-auto mb-3 text-yellow-400" />
            <h3 className="font-semibold mb-1">Play Games</h3>
            <p className="text-sm text-gray-400">Slots, Blackjack & more</p>
          </Link>
          <Link href="/store" className="casino-card p-6 rounded-2xl text-center hover:border-yellow-500/50 transition-all">
            <ShoppingCart className="w-10 h-10 mx-auto mb-3 text-yellow-400" />
            <h3 className="font-semibold mb-1">Gold Store</h3>
            <p className="text-sm text-gray-400">Get GC + Free SC</p>
          </Link>
          <Link href="/wallet" className="casino-card p-6 rounded-2xl text-center hover:border-yellow-500/50 transition-all">
            <TrendingUp className="w-10 h-10 mx-auto mb-3 text-yellow-400" />
            <h3 className="font-semibold mb-1">Wallet</h3>
            <p className="text-sm text-gray-400">View balance & history</p>
          </Link>
        </div>
      </div>

      <div className="casino-card p-6 rounded-2xl">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-400" />
          How to Win Real Prizes
        </h2>
        <div className="grid md:grid-cols-3 gap-4 text-center">
          <div className="p-4">
            <div className="text-3xl mb-2">🛒</div>
            <h3 className="font-semibold mb-1">Buy GC</h3>
            <p className="text-sm text-gray-400">Purchase GC packages and get FREE SC bonus</p>
          </div>
          <div className="p-4">
            <div className="text-3xl mb-2">🎮</div>
            <h3 className="font-semibold mb-1">Play with SC</h3>
            <p className="text-sm text-gray-400">Use Sweepstakes Coins to play for prizes</p>
          </div>
          <div className="p-4">
            <div className="text-3xl mb-2">🏆</div>
            <h3 className="font-semibold mb-1">Win Prizes</h3>
            <p className="text-sm text-gray-400">Win SC that can be redeemed for gift cards & more!</p>
          </div>
        </div>
      </div>
    </div>
  )
}
