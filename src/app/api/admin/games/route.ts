import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const games = await prisma.game.findMany({
    orderBy: { name: 'asc' },
  })

  return NextResponse.json(games)
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, type, description, rtp, minBet, maxBet } = body

    const game = await prisma.game.create({
      data: {
        name,
        type,
        description,
        rtp: rtp || 0.95,
        minBet: minBet || 1,
        maxBet: maxBet || 1000,
        status: 'active',
      }
    })

    return NextResponse.json(game)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create game' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { gameId, ...data } = body

    const game = await prisma.game.update({
      where: { id: gameId },
      data,
    })

    return NextResponse.json(game)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update game' }, { status: 500 })
  }
}
