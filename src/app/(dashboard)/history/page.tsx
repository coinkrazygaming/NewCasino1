'use client'

import { useEffect, useState } from 'react'
import { History, Calendar } from 'lucide-react'

interface Transaction {
  id: string
  type: string
  amount: number
  currency: string
  status: string
  details?: string
  createdAt: string
}

export default function HistoryPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/transactions')
      .then(res => res.json())
      .then(data => setTransactions(data.slice(0, 50)))
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
          <span className="gold-gradient">Transaction</span> History
        </h1>
        <p className="text-gray-400">View all your past transactions</p>
      </div>

      <div className="casino-card rounded-2xl overflow-hidden">
        {transactions.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No transactions yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-800/30">
                    <td className="px-4 py-3 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        tx.type === 'WIN' || tx.type === 'BONUS' 
                          ? 'bg-green-500/20 text-green-400'
                          : tx.type === 'BET'
                          ? 'bg-blue-500/20 text-blue-400'
                          : tx.type === 'PURCHASE'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-gray-700 text-gray-300'
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-semibold ${
                        tx.type === 'WIN' || tx.type === 'BONUS' ? 'text-green-400' : 'text-white'
                      }`}>
                        {tx.type === 'WIN' || tx.type === 'BONUS' ? '+' : ''}{tx.amount.toLocaleString()} {tx.currency}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs ${
                        tx.status === 'COMPLETED' ? 'text-green-400' : 'text-gray-400'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
