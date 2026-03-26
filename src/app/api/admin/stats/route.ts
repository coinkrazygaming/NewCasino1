import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [
    totalUsers,
    activeUsers,
    totalTransactions,
    totalGCPurchased,
    totalSCAwarded,
    recentTransactions,
    topGames
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { status: 'ACTIVE' } }),
    prisma.transaction.count(),
    prisma.transaction.aggregate({
      where: { type: 'PURCHASE', currency: 'GC' },
      _sum: { amount: true }
    }),
    prisma.transaction.aggregate({
      where: { type: 'BONUS', currency: 'SC' },
      _sum: { amount: true }
    }),
    prisma.transaction.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { username: true } } }
    }),
    prisma.bet.groupBy({
      by: ['gameId'],
      _count: true,
      _sum: { betAmount: true },
      orderBy: { _count: { gameId: 'desc' } },
      take: 5
    })
  ])

  const gameIds = topGames.map(g => g.gameId)
  const games = await prisma.game.findMany({
    where: { id: { in: gameIds } }
  })

  const gamesWithStats = topGames.map(g => ({
    game: games.find(gm => gm.id === g.gameId),
    betCount: g._count,
    totalBets: g._sum.betAmount || 0
  }))

  return NextResponse.json({
    users: { total: totalUsers, active: activeUsers },
    transactions: { total: totalTransactions },
    revenue: {
      gcPurchased: totalGCPurchased._sum.amount || 0,
      scAwarded: totalSCAwarded._sum.amount || 0
    },
    recentTransactions,
    topGames: gamesWithStats
  })
}
