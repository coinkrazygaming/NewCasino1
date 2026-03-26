export interface User {
  id: string
  email: string
  username: string
  gcBalance: number
  scBalance: number
  role: 'USER' | 'ADMIN'
  status: 'ACTIVE' | 'BANNED' | 'SUSPENDED'
  createdAt: Date
}

export interface Game {
  id: string
  name: string
  type: 'SLOTS' | 'BLACKJACK' | 'ROULETTE' | 'VIDEO_POKER' | 'FISH'
  description?: string
  thumbnail?: string
  rtp: number
  minBet: number
  maxBet: number
  status: string
}

export interface Transaction {
  id: string
  userId: string
  type: 'DEPOSIT' | 'PURCHASE' | 'BONUS' | 'BET' | 'WIN' | 'WITHDRAW' | 'ADJUSTMENT'
  amount: number
  currency: 'GC' | 'SC'
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
  details?: string
  createdAt: Date
}

export interface Bet {
  id: string
  userId: string
  gameId: string
  betAmount: number
  currency: 'GC' | 'SC'
  wonAmount: number
  won: boolean
  createdAt: Date
}

export interface StorePackage {
  id: string
  name: string
  gcAmount: number
  price: number
  scBonus: number
  popular?: boolean
}
