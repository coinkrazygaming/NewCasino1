'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Users, Gamepad2, Receipt, BarChart3, Crown, LogOut } from 'lucide-react'

const adminNav = [
  { name: 'Overview', href: '/admin', icon: BarChart3 },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Games', href: '/admin/games', icon: Gamepad2 },
  { name: 'Transactions', href: '/admin/transactions', icon: Receipt },
]

export default function AdminOverviewPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated' && (session.user as any)?.role !== 'ADMIN') {
      router.push('/dashboard')
    }
  }, [status, session, router])

  useEffect(() => {
    if (session && (session.user as any)?.role === 'ADMIN') {
      fetch('/api/admin/stats')
        .then(res => res.json())
        .then(setStats)
        .catch(console.error)
    }
  }, [session])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    )
  }

  if (!session || (session.user as any)?.role !== 'ADMIN') return null

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800/50 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="flex items-center gap-2">
                <Crown className="w-6 h-6 text-purple-400" />
                <span className="text-xl font-bold font-heading">
                  <span className="text-purple-400">Admin</span> Panel
                </span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-gray-400 hover:text-white">
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="md:w-64 flex-shrink-0">
            <nav className="space-y-2">
              {adminNav.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 text-gray-300"
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              ))}
            </nav>

            {stats && (
              <div className="mt-8 p-4 bg-gray-800/50 rounded-xl">
                <h3 className="font-semibold mb-3 text-gray-300">Quick Stats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Users</span>
                    <span className="text-white font-medium">{stats.users?.total || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Active Users</span>
                    <span className="text-green-400 font-medium">{stats.users?.active || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Transactions</span>
                    <span className="text-white font-medium">{stats.transactions?.total || 0}</span>
                  </div>
                </div>
              </div>
            )}
          </aside>

          <main className="flex-1 space-y-6">
            <h1 className="text-2xl font-bold font-heading">
              <span className="text-purple-400">Platform</span> Overview
            </h1>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-gray-800/50 p-6 rounded-xl">
                <p className="text-gray-400 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-white">{stats?.users?.total || 0}</p>
              </div>
              <div className="bg-gray-800/50 p-6 rounded-xl">
                <p className="text-gray-400 text-sm">Active Users</p>
                <p className="text-3xl font-bold text-green-400">{stats?.users?.active || 0}</p>
              </div>
              <div className="bg-gray-800/50 p-6 rounded-xl">
                <p className="text-gray-400 text-sm">Transactions</p>
                <p className="text-3xl font-bold text-yellow-400">{stats?.transactions?.total || 0}</p>
              </div>
            </div>

            <div className="bg-gray-800/50 p-6 rounded-xl">
              <h2 className="font-bold mb-4">Recent Transactions</h2>
              <div className="space-y-3">
                {stats?.recentTransactions?.slice(0, 5).map((tx: any) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-900/30">
                    <div>
                      <p className="font-medium">{tx.user?.username}</p>
                      <p className="text-xs text-gray-400">{tx.type}</p>
                    </div>
                    <span className={tx.type === 'WIN' || tx.type === 'BONUS' ? 'text-green-400' : 'text-white'}>
                      {tx.amount} {tx.currency}
                    </span>
                  </div>
                )) || <p className="text-gray-400">No recent transactions</p>}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
