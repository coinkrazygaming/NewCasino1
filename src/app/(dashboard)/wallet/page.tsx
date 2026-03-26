'use client'

import { useEffect, useState } from 'react'
import { Wallet as WalletIcon, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react'

interface Transaction {
  id: string
  type: string
  amount: number
  currency: string
  status: string
  details?: string
  createdAt: string
}

const typeColors: Record<string, string> = {
  PURCHASE: 'text-yellow-400',
  BONUS: 'text-red-400',
  BET: 'text-blue-400',
  WIN: 'text-green-400',
  ADJUSTMENT: 'text-purple-400',
}

export default function WalletPage() {
  const [balance, setBalance] = useState({ gcBalance: 0, scBalance: 0 })
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/wallet').then(r => r.json()),
      fetch('/api/transactions').then(r => r.json()),
    ])
      .then(([walletData, txData]) => {
        setBalance({ gcBalance: walletData.gcBalance || 0, scBalance: walletData.scBalance || 0 })
        setTransactions(txData.slice(0, 20))
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

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
          <span className="gold-gradient">Wallet</span>
        </h1>
        <p className="text-gray-400">View your balance and transaction history</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="casino-card p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <span className="text-2xl">🪙</span>
            </div>
            <div>
              <p className="text-sm text-gray-400">Gold Coins</p>
              <p className="text-2xl font-bold text-yellow-400">{balance.gcBalance.toLocaleString()}</p>
            </div>
          </div>
          <p className="text-xs text-gray-500">Entertainment only - no real value</p>
        </div>

        <div className="casino-card p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
              <span className="text-2xl">★</span>
            </div>
            <div>
              <p className="text-sm text-gray-400">Sweepstakes Coins</p>
              <p className="text-2xl font-bold text-red-400">{balance.scBalance.toLocaleString()}</p>
            </div>
          </div>
          <p className="text-xs text-gray-500">100 SC = $100 USD value</p>
        </div>
      </div>

      <div className="casino-card p-6 rounded-2xl">
        <h2 className="text-xl font-bold mb-4">Transaction History</h2>
        {transactions.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No transactions yet</p>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    tx.type === 'WIN' || tx.type === 'BONUS' ? 'bg-green-500/20' : 'bg-gray-700'
                  }`}>
                    {tx.type === 'WIN' || tx.type === 'BONUS' ? (
                      <ArrowUpRight className="w-4 h-4 text-green-400" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <p className={`font-medium ${typeColors[tx.type] || 'text-gray-300'}`}>
                      {tx.type}
                    </p>
                    <p className="text-xs text-gray-500">{new Date(tx.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${tx.type === 'WIN' || tx.type === 'BONUS' ? 'text-green-400' : 'text-white'}`}>
                    {tx.type === 'WIN' || tx.type === 'BONUS' ? '+' : ''}{tx.amount.toLocaleString()} {tx.currency}
                  </p>
                  <p className="text-xs text-gray-500">{tx.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
