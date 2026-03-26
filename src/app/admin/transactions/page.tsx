'use client'

import { useEffect, useState } from 'react'
import { Receipt, Calendar, User, ArrowUpRight, ArrowDownRight } from 'lucide-react'

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/transactions')
      .then(res => res.json())
      .then(data => setTransactions(data.transactions || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
    </div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-heading">
        <span className="text-purple-400">Transaction</span> History
      </h1>

      <div className="bg-gray-800/50 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Date</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">User</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Type</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Amount</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-gray-800/30">
                <td className="px-4 py-3 text-sm text-gray-400">
                  {new Date(tx.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium">{tx.user?.username}</p>
                  <p className="text-xs text-gray-400">{tx.user?.email}</p>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    tx.type === 'WIN' || tx.type === 'BONUS' ? 'bg-green-500/20 text-green-400' :
                    tx.type === 'PURCHASE' ? 'bg-yellow-500/20 text-yellow-400' :
                    tx.type === 'BET' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-gray-700 text-gray-300'
                  }`}>
                    {tx.type}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={tx.type === 'WIN' || tx.type === 'BONUS' ? 'text-green-400' : 'text-white'}>
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
    </div>
  )
}
