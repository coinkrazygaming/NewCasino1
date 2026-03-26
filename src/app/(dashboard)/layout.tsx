'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { 
  LayoutDashboard, Gamepad2, ShoppingCart, Wallet, 
  History, User, LogOut, Menu, X, Crown, Sparkles
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Games', href: '/games', icon: Gamepad2 },
  { name: 'Store', href: '/store', icon: ShoppingCart },
  { name: 'Wallet', href: '/wallet', icon: Wallet },
  { name: 'History', href: '/history', icon: History },
  { name: 'Profile', href: '/profile', icon: User },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [balances, setBalances] = useState({ gc: 0, sc: 0 })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetch('/api/wallet')
        .then(res => res.json())
        .then(data => setBalances({ gc: data.gcBalance || 0, sc: data.scBalance || 0 }))
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

  if (!session) return null

  const isAdmin = (session.user as any)?.role === 'ADMIN'

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-800"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <Link href="/dashboard" className="text-xl font-bold font-heading">
                <span className="gold-gradient">Jackpot</span>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              {/* Balance Display */}
              <div className="hidden sm:flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20">
                  <span className="text-lg">🪙</span>
                  <span className="font-semibold text-yellow-400">{balances.gc.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20">
                  <span className="text-lg">★</span>
                  <span className="font-semibold text-red-400">{balances.sc.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-gray-900/95 pt-20 px-4">
          <div className="space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                  pathname === item.href
                    ? 'bg-yellow-500/10 text-yellow-400'
                    : 'hover:bg-gray-800 text-gray-300'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 text-gray-300"
              >
                <Crown className="w-5 h-5 text-purple-400" />
                Admin Panel
              </Link>
            )}
          </div>
          <div className="mt-6 p-4 bg-gray-800 rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">GC Balance</span>
              <span className="text-yellow-400 font-semibold">{balances.gc.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">SC Balance</span>
              <span className="text-red-400 font-semibold">{balances.sc.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar - Desktop */}
      <aside className="hidden md:fixed inset-y-0 left-0 w-64 pt-16 bg-gray-900/50 border-r border-gray-800">
        <nav className="p-4 space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                pathname === item.href
                  ? 'bg-yellow-500/10 text-yellow-400'
                  : 'hover:bg-gray-800 text-gray-300'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 text-gray-300"
            >
              <Crown className="w-5 h-5 text-purple-400" />
              Admin Panel
            </Link>
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="md:pl-64 pt-16">
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
