'use client'

import { useSession } from 'next-auth/react'
import { User, Mail, Calendar, Shield } from 'lucide-react'

export default function ProfilePage() {
  const { data: session } = useSession()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-heading mb-2">
          <span className="gold-gradient">Profile</span> Settings
        </h1>
        <p className="text-gray-400">Manage your account information</p>
      </div>

      <div className="casino-card p-6 rounded-2xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-3xl font-bold text-gray-900">
            {(session?.user?.name || 'U')[0].toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold">{session?.user?.name || 'Player'}</h2>
            <p className="text-gray-400">{session?.user?.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/30">
            <User className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-400">Username</p>
              <p className="font-medium">{session?.user?.name || 'Player'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/30">
            <Mail className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-400">Email</p>
              <p className="font-medium">{session?.user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/30">
            <Calendar className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-400">Account Created</p>
              <p className="font-medium">Since 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/30">
            <Shield className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-400">Account Status</p>
              <p className="font-medium text-green-400">Active</p>
            </div>
          </div>
        </div>
      </div>

      <div className="casino-card p-6 rounded-2xl">
        <h3 className="font-bold mb-4">Account Info</h3>
        <p className="text-sm text-gray-400">
          This is a sweepstakes social casino account. Gold Coins (GC) have no real value 
          and cannot be redeemed. Sweepstakes Coins (SC) are awarded as promotional bonuses 
          and may be eligible for redemption for prizes based on applicable terms.
        </p>
      </div>
    </div>
  )
}
