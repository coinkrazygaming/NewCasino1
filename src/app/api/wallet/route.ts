import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = (session.user as any).id
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { gcBalance: true, scBalance: true }
  })

  return NextResponse.json(user)
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as any).id
    const body = await request.json()
    const { amount, currency, type } = body

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (type === 'add') {
      const updated = await prisma.user.update({
        where: { id: userId },
        data: currency === 'SC'
          ? { scBalance: { increment: amount } }
          : { gcBalance: { increment: amount } }
      })

      await prisma.transaction.create({
        data: {
          userId,
          type: type === 'add' ? 'DEPOSIT' : 'WITHDRAW',
          amount,
          currency,
          status: 'COMPLETED',
        }
      })

      return NextResponse.json({ gcBalance: updated.gcBalance, scBalance: updated.scBalance })
    }

    return NextResponse.json({ error: 'Invalid operation' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: 'Wallet operation failed' }, { status: 500 })
  }
}
