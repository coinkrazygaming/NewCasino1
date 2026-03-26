import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const games = await prisma.game.findMany({
    where: { status: 'active' },
    orderBy: { name: 'asc' },
  })
  return NextResponse.json(games)
}

export async function POST(request: Request) {
  try {
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
